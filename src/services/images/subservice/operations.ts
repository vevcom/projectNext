import '@pn-server-only'
import { imageSchemas } from './schemas'
import { allowedExtensions, avifConvertionOptions, imageSizes } from './constants'
import { visibilityOperations } from '@/services/visibility/operations'
import { defineSubOperation } from '@/services/serviceOperation'
import { ServerError } from '@/services/error'
import { implementStore } from '@/lib/store/implementStore'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import sharp from 'sharp'
import { File } from 'node:buffer'
import type { Prisma } from '@/prisma-generated-pn-types'
import type { z } from 'zod'

const imageStore = implementStore({
    staticStorePrefix: 'images',
    allowedExtentions: [...allowedExtensions, 'avif'],
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
        operation: () => async ({ prisma, params, data }) => {
            const { imageFile, ...meta } = data
            const buffer = Buffer.from(await imageFile.arrayBuffer())
            const avifBuffer = await sharp(buffer).toFormat('avif').avif(avifConvertionOptions).toBuffer()
            const avifFile = new File([avifBuffer], 'image.avif', { type: 'image/avif' })

            const uploadPromises = [
                createOneInStore(avifFile, ['avif'], imageSizes.small),
                createOneInStore(avifFile, ['avif'], imageSizes.medium),
                createOneInStore(avifFile, ['avif'], imageSizes.large),
                imageStore.createFile(imageFile, [...allowedExtensions]),
            ]

            const [smallSize, mediumSize, largeSize, original] = await Promise.all(uploadPromises)
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
                    fsLocationSmallSize,
                    fsLocationMediumSize,
                    fsLocationLargeSize,
                    extOriginal,
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
                })
            }
        }
    }),

    readPageOfImagesInCollection: defineSubOperation({
        paramsSchema: () => imageSchemas.paramsSchemaReadPageOfImagesInCollection,
        operation: () => async ({ prisma, params }) =>
            await prisma.image.findMany({
                where: {
                    collectionId: params.paging.details.collectionId,
                },
                ...cursorPageingSelection(params.paging.page)
            }),
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
 * Creates one image from a file.
 * @param file - The file to create the image from
 * @param allowedExt - The allowed extensions for the file
 * @param size - The size to resize the image to
 * @returns
 */
async function createOneInStore(file: File, allowedExt: string[], size: number) {
    const ret = await imageStore.createFile(file, allowedExt, async (buffer) => await sharp(buffer).resize(size, size, {
        fit: sharp.fit.inside,
        withoutEnlargement: true
    }).toBuffer())
    return ret
}

export function uniqueCollectionWhere(params: z.infer<typeof imageSchemas.paramsSchemaCollection>) {
    return (
        'collectionId' in params ? { id: params.collectionId } : { name: params.collectionName }
    ) satisfies Prisma.ImageCollectionWhereUniqueInput
}
