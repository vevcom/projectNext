import '@pn-server-only'
import { imageSchemas } from './schemas'
import { allowedExtensions, avifConvertionOptions, imageSizes, type expandedImageCollectionIncluder } from './constants'
import { visibilityOperations } from '@/services/visibility/operations'
import { defineSubOperation } from '@/services/serviceOperation'
import { ServerError } from '@/services/error'
import { implementStore } from '@/lib/store/implementStore'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import sharp from 'sharp'
import { File } from 'node:buffer'
import type { Image, Prisma, StandardImage } from '@/prisma-generated-pn-types'
import type { ExpandedImageCollection } from './types'
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
     * On uplad time the image is processed to the correct sizes and save it to the store.
     * It will also save the original image to the store.
     * All images are saved as avif (except the original).
     */
    uploadImage: defineSubOperation({
        paramsSchema: () => imageSchemas.paramsSchemaCollection,
        dataSchema: () => imageSchemas.uploadImage,
        operation: (
            { uploadAsStandardImage }: { uploadAsStandardImage: StandardImage | null }
        ) => async ({ prisma, params, data }) => {
            const { imageFile, ...meta } = data
            const buffer = Buffer.from(await imageFile.arrayBuffer())

            const uploadPromises = [
                createResizedAvifInStore(buffer, imageSizes.tiny),
                createResizedAvifInStore(buffer, imageSizes.small),
                createResizedAvifInStore(buffer, imageSizes.medium),
                createResizedAvifInStore(buffer, imageSizes.large),
                imageStore.createFile(imageFile, [...allowedExtensions]),
            ]

            const [tinySize, smallSize, mediumSize, largeSize, original] = await Promise.all(uploadPromises)
            const fsLocationTinySize = tinySize.fsLocation
            const fsLocationSmallSize = smallSize.fsLocation
            const fsLocationMediumSize = mediumSize.fsLocation
            const fsLocationLargeSize = largeSize.fsLocation
            const fsLocationOriginal = original.fsLocation
            const extOriginal = original.ext
            return await prisma.image.create({
                data: {
                    name: meta.imageName,
                    alt: meta.imageAlt,
                    license: meta.imageLicenseId ? { connect: { id: meta.imageLicenseId } } : undefined,
                    credit: meta.imageCredit,
                    fsLocationOriginal,
                    fsLocationTinySize,
                    fsLocationSmallSize,
                    fsLocationMediumSize,
                    fsLocationLargeSize,
                    extOriginal,
                    standardImage: uploadAsStandardImage,
                    collection: {
                        connect: uniqueCollectionWhere(params)
                    }
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
            })
            await prisma.image.delete({
                where: {
                    id: params.imageId,
                },
            })
            await imageStore.destroyFile(image.fsLocationOriginal)
            await imageStore.destroyFile(image.fsLocationTinySize)
            await imageStore.destroyFile(image.fsLocationSmallSize)
            await imageStore.destroyFile(image.fsLocationMediumSize)
            await imageStore.destroyFile(image.fsLocationLargeSize)
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
async function createResizedAvifInStore(buffer: Buffer, size: number) {
    const avifBuffer = await sharp(buffer)
        .resize(size, size, {
            fit: sharp.fit.inside,
            withoutEnlargement: true
        })
        .toFormat('avif')
        .avif(avifConvertionOptions)
        .toBuffer()
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
    defaultCoverImage: Image | null,
): ExpandedImageCollection {
    const { images, _count, ...rest } = collection
    return {
        ...rest,
        coverImage: rest.coverImage ?? images[0] ?? defaultCoverImage,
        numberOfImages: _count.images,
    }
}
