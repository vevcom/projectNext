import '@pn-server-only'
import { imageSchemas } from './schemas'
import {
    allowedExtensions,
    avifConvertionOptions,
    expandedImageIncluder,
    imageSizes,
    type expandedImageCollectionIncluder
} from './constants'
import { visibilityOperations } from '@/services/visibility/operations'
import { defineSubOperation } from '@/services/serviceOperation'
import { ServerError } from '@/services/error'
import { implementStore } from '@/lib/store/implementStore'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import sharp from 'sharp'
import { File } from 'node:buffer'
import type { Prisma, StandardImage } from '@/prisma-generated-pn-types'
import type { ExpandedImage, ExpandedImageCollection } from './types'
import type { z } from 'zod'

const imageStoreAllowedExtensions = [...allowedExtensions, 'avif'] as const

const imageStore = implementStore({
    staticStorePrefix: 'images',
    allowedExtentions: imageStoreAllowedExtensions,
})

export const imageOperations = {
    destroyCollection: defineSubOperation({
        paramsSchema: () => imageSchemas.paramsSchemaCollection,
        opensTransaction: true,
        operation: () => async ({ prisma, params }) => {
            const collection = await prisma.imageCollection.findUnique({
                where: uniqueCollectionWhere(params),
            })
            if (!collection) throw new ServerError('NOT FOUND', 'Collection ikke funnet')

            await prisma.$transaction(async (tx) => {
                await tx.imageCollection.delete({
                    where: uniqueCollectionWhere(params),
                })
                await visibilityOperations.destroy.internalCall({
                    prisma: tx,
                    params: { visibilityId: collection.visibilityAdminId },
                })
                await visibilityOperations.destroy.internalCall({
                    prisma: tx,
                    params: { visibilityId: collection.visibilityRegularId },
                })
            })
        }
    }),
    updateCollection: defineSubOperation({
        paramsSchema: () => imageSchemas.paramsSchemaCollection,
        dataSchema: () => imageSchemas.updateCollection,
        operation: () => async ({ prisma, params, data }) =>
            prisma.imageCollection.update({
                where: uniqueCollectionWhere(params),
                data: {
                    name: data.collectionName,
                    description: data.collectionDescription,
                    coverImage: {
                        connect: data.coverImageId ? {
                            id: data.coverImageId
                        } : undefined
                    }
                }
            })
    }),

    /**
     * On upload time, only the original is saved to the store synchronously (plus a tiny inline
     * blur placeholder) - the real resized/avif variants are produced in the background by
     * processImageVariants, so this stays fast enough to run inside a caller's transaction.
     */
    uploadImage: defineSubOperation({
        paramsSchema: () => imageSchemas.paramsSchemaCollection,
        dataSchema: () => imageSchemas.uploadImage,
        operation: (
            { uploadAsStandardImage }: { uploadAsStandardImage: StandardImage | null }
        ) => async ({ prisma, params, data }) => {
            const { imageFile, ...meta } = data
            const buffer = Buffer.from(await imageFile.arrayBuffer())

            const [placeholderBuffer, original] = await Promise.all([
                resizeToAvifBuffer(buffer, imageSizes.placeholder),
                imageStore.createFile(imageFile, [...allowedExtensions]),
            ])
            const placeholderDataUrl = `data:image/avif;base64,${placeholderBuffer.toString('base64')}`

            return await prisma.image.create({
                data: {
                    name: meta.imageName,
                    alt: meta.imageAlt,
                    license: meta.imageLicenseId ? { connect: { id: meta.imageLicenseId } } : undefined,
                    credit: meta.imageCredit,
                    fsLocationOriginal: original.fsLocation,
                    extOriginal: original.ext,
                    placeholderDataUrl,
                    standardImage: uploadAsStandardImage,
                    collection: {
                        connect: uniqueCollectionWhere(params)
                    }
                },
                include: expandedImageIncluder,
            })
        }
    }),

    /**
     * Produces the real tiny/small/medium/large avif variants for an already-uploaded image.
     * Called by the background worker container (src/worker.ts), never directly from a request.
     */
    processImageVariants: defineSubOperation({
        paramsSchema: () => imageSchemas.paramsSchemaImage,
        operation: () => async ({ prisma, params }) => {
            const image = await prisma.image.findUniqueOrThrow({ where: { id: params.imageId } })
            try {
                const buffer = await imageStore.readStoredFile(image.fsLocationOriginal)
                const [tinySize, smallSize, mediumSize, largeSize] = await Promise.all([
                    createResizedAvifInStore(buffer, imageSizes.tiny),
                    createResizedAvifInStore(buffer, imageSizes.small),
                    createResizedAvifInStore(buffer, imageSizes.medium),
                    createResizedAvifInStore(buffer, imageSizes.large),
                ])
                await prisma.processedImageFiles.create({
                    data: {
                        imageId: image.id,
                        fsLocationTinySize: tinySize.fsLocation,
                        fsLocationSmallSize: smallSize.fsLocation,
                        fsLocationMediumSize: mediumSize.fsLocation,
                        fsLocationLargeSize: largeSize.fsLocation,
                    }
                })
            } catch (error) {
                await prisma.image.update({
                    where: { id: image.id },
                    data: {
                        processingAttempts: { increment: 1 },
                        processingError: String(error),
                        processingStartedAt: null,
                    }
                })
            }
        }
    }),

    /**
     * Manual escape hatch for images stuck in processingStatus 'FAILED' - resets the bookkeeping
     * so the next worker tick picks it up again.
     */
    retryImageProcessing: defineSubOperation({
        paramsSchema: () => imageSchemas.paramsSchemaImage,
        operation: () => async ({ prisma, params }) => {
            await prisma.image.update({
                where: { id: params.imageId },
                data: {
                    processingAttempts: 0,
                    processingStartedAt: null,
                    processingError: null,
                }
            })
        }
    }),

    uploadManyImages: defineSubOperation({
        paramsSchema: () => imageSchemas.paramsSchemaUploadManyImages,
        dataSchema: () => imageSchemas.uploadManyImages,
        operation: () => async ({ params, data }) => {
            for (const imageFile of data.imageFiles) {
                const imageName = params.useFileName ? imageFile.name.split('.')[0] : undefined
                await imageOperations.uploadImage.internalCall({
                    params: {
                        collectionId: params.collectionId,
                    },
                    data: {
                        imageFile,
                        imageName,
                        imageAlt: imageFile.name.split('.')[0],
                        imageLicenseId: data.imageLicenseId,
                        imageCredit: data.imageCredit
                    },
                    operationImplementationFields: { uploadAsStandardImage: null }
                })
            }
        }
    }),

    readPageOfImagesInCollection: defineSubOperation({
        paramsSchema: () => imageSchemas.paramsSchemaReadPageOfImagesInCollection,
        operation: () => async ({ prisma, params }) => {
            const { cursor, ...rest } = cursorPageingSelection(params.paging.page)
            return await prisma.image.findMany({
                where: {
                    collectionId: params.collectionId,
                },
                include: expandedImageIncluder,
                ...rest,
                cursor: cursor ? { id: cursor.imageId } : undefined,
            })
        },
    }),

    updateImageMeta: defineSubOperation({
        paramsSchema: () => imageSchemas.paramsSchemaImage,
        dataSchema: () => imageSchemas.updateImageMeta,
        operation: () => async ({ prisma, params, data }) =>
            await prisma.image.update({
                where: {
                    id: params.imageId,
                },
                include: expandedImageIncluder,
                data: {
                    license: data.imageLicenseId !== undefined ? {
                        ...(data.imageLicenseId ? { connect: { id: data.imageLicenseId } } : { disconnect: true })
                    } : undefined,
                    name: data.imageName,
                    alt: data.imageAlt,
                    credit: data.imageCredit,
                }
            })
    }),

    destroyImage: defineSubOperation({
        paramsSchema: () => imageSchemas.paramsSchemaImage,
        operation: () => async ({ prisma, params }) => {
            const image = await prisma.image.findUniqueOrThrow({
                where: {
                    id: params.imageId,
                },
                include: expandedImageIncluder,
            })
            await prisma.image.delete({
                where: {
                    id: params.imageId,
                },
            })
            await imageStore.destroyFile(image.fsLocationOriginal)
            if (image.processedFiles) {
                await imageStore.destroyFile(image.processedFiles.fsLocationTinySize)
                await imageStore.destroyFile(image.processedFiles.fsLocationSmallSize)
                await imageStore.destroyFile(image.processedFiles.fsLocationMediumSize)
                await imageStore.destroyFile(image.processedFiles.fsLocationLargeSize)
            }
        }
    }),

    readCollectionOfImage: defineSubOperation({
        paramsSchema: () => imageSchemas.paramsSchemaImage,
        operation: () => async ({ prisma, params }) =>
            (await prisma.image.findUniqueOrThrow({
                where: {
                    id: params.imageId,
                },
                select: {
                    collection: true,
                }
            })).collection
    })
} as const

/**
 * Resizes the original image buffer down to the given size before encoding to avif, so the
 * (potentially much larger) original resolution is never itself run through avif encoding.
 */
async function resizeToAvifBuffer(buffer: Buffer, size: number) {
    return await sharp(buffer)
        .resize(size, size, {
            fit: sharp.fit.inside,
            withoutEnlargement: true
        })
        .toFormat('avif')
        .avif(avifConvertionOptions)
        .toBuffer()
}

async function createResizedAvifInStore(buffer: Buffer, size: number) {
    const avifBuffer = await resizeToAvifBuffer(buffer, size)
    const avifFile = new File([new Uint8Array(avifBuffer)], 'image.avif', { type: 'image/avif' })
    return imageStore.createFile(avifFile, ['avif'])
}

export function uniqueCollectionWhere(params: z.infer<typeof imageSchemas.paramsSchemaCollection>) {
    return (
        'collectionId' in params ? { id: params.collectionId } : { name: params.collectionName }
    ) satisfies Prisma.ImageCollectionWhereUniqueInput
}

/**
 * Enriches a collection (read with {@link expandedImageCollectionIncluder}) into the
 * ExpandedImageCollection shape. The cover image is resolved as the
 * collection's explicit cover, else its first image, else the provided default (dynamic
 * collections pass the DEFAULT_IMAGE_COLLECTION_COVER standard image).
 */
export function expandImageCollection(
    collection: Prisma.ImageCollectionGetPayload<{ include: typeof expandedImageCollectionIncluder }>,
    defaultCoverImage: ExpandedImage | null,
): ExpandedImageCollection {
    const { images, _count, ...rest } = collection
    return {
        ...rest,
        coverImage: rest.coverImage ?? images[0] ?? defaultCoverImage,
        numberOfImages: _count.images,
    }
}
