import '@pn-server-only'
import { readSpecialImageCollection } from './collections/read'
import { imageAuthers } from './authers'
import { imageSchemas } from './schemas'
import { allowedExtensions, avifConvertionOptions, imageSizes } from './config'
import { defineOperation } from '@/services/serviceOperation'
import { ServerError } from '@/services/error'
import { createFile } from '@/services/store/createFile'
import logger from '@/lib/logger'
import { readPageInputSchemaObject } from '@/lib/paging/schema'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import sharp from 'sharp'
import { SpecialImage } from '@prisma/client'
import { z } from 'zod'

/**
 * Creates one image from a file.
 * @param file - The file to create the image from
 * @param allowedExt - The allowed extensions for the file
 * @param size - The size to resize the image to
 * @returns
 */
async function createOneInStore(file: File, allowedExt: string[], size: number) {
    const ret = await createFile(file, 'images', allowedExt, async (buffer) => await sharp(buffer).resize(size, size, {
        fit: sharp.fit.inside,
        withoutEnlargement: true
    }).toBuffer())
    return ret
}

/**
 * WARNING: This function should only be used in extreme cases, Therefore it is not exported.
 * Creates bad image this should really only happen in worst case scenario
 * where the server has lost a image and needs to be replaced with a bad image.
 * A bad image is an image that has no correct fsLocation attributes.
 * @param name - the name of the image
 * @param config - the config for the image (special)
 */
const createSourceless = defineOperation({
    authorizer: () => imageAuthers.createSourcelessImage.dynamicFields({}),
    paramsSchema: z.object({
        name: z.string(),
        special: z.nativeEnum(SpecialImage),
    }),
    operation: async ({ prisma, params: { name, special } }) => {
        const standardCollection = await readSpecialImageCollection('STANDARDIMAGES')
        logger.warn(`
            creating a bad image, Something has caused the server to lose a neccesary image. 
            It was replaced with an image model with no correct fsLocation atrributes.
        `)
        return await prisma.image.create({
            data: {
                name,
                special,
                fsLocationOriginal: 'not_found',
                fsLocationMediumSize: 'not_found',
                fsLocationSmallSize: 'not_found',
                fsLocationLargeSize: 'not_found',
                extOriginal: 'jpg',
                alt: 'not found',
                collection: {
                    connect: {
                        id: standardCollection.id
                    }
                }
            },
        })
    }
})

export const imageMethods = {
    /**
     * Creates an image.
     * The method will resize the image to the correct sizes and save it to the store.
     * It will also save the original image to the store.
     * All images are saved as avif (except the original).
     * @param collectionId - The id of the collection to add the image to
     */
    create: defineOperation({
        authorizer: () => imageAuthers.create.dynamicFields({}),
        paramsSchema: z.object({
            collectionId: z.number(),
        }),
        dataSchema: imageSchemas.create,
        operation: async ({ prisma, params: { collectionId }, data }) => {
            const { file, ...meta } = data
            const buffer = Buffer.from(await file.arrayBuffer())
            const avifBuffer = await sharp(buffer).toFormat('avif').avif(avifConvertionOptions).toBuffer()
            const avifFile = new File([avifBuffer], 'image.avif', { type: 'image/avif' })

            const uploadPromises = [
                createOneInStore(avifFile, ['avif'], imageSizes.small),
                createOneInStore(avifFile, ['avif'], imageSizes.medium),
                createOneInStore(avifFile, ['avif'], imageSizes.large),
                createFile(file, 'images', [...allowedExtensions]),
            ]

            const [smallSize, mediumSize, largeSize, original] = await Promise.all(uploadPromises)
            const fsLocationSmallSize = smallSize.fsLocation
            const fsLocationMediumSize = mediumSize.fsLocation
            const fsLocationLargeSize = largeSize.fsLocation
            const fsLocationOriginal = original.fsLocation
            const extOriginal = original.ext
            return await prisma.image.create({
                data: {
                    name: meta.name,
                    alt: meta.alt,
                    license: meta.licenseId ? { connect: { id: meta.licenseId } } : undefined,
                    credit: meta.credit,
                    fsLocationOriginal,
                    fsLocationSmallSize,
                    fsLocationMediumSize,
                    fsLocationLargeSize,
                    extOriginal,
                    collection: {
                        connect: {
                            id: collectionId,
                        }
                    }
                }
            })
        }
    }),
    /**
     * Creates many images from files.
     * The method will resize the images to the correct sizes and save them to the store.
     */
    createMany: defineOperation({
        authorizer: () => imageAuthers.createMany.dynamicFields({}),
        paramsSchema: z.object({
            useFileName: z.boolean(),
            collectionId: z.number(),
        }),
        dataSchema: imageSchemas.createMany,
        operation: async ({
            params: { useFileName, collectionId },
            data,
        }) => {
            console.log('data', data)
            for (const file of data.files) {
                console.log('file', file)
                const name = useFileName ? file.name.split('.')[0] : undefined
                await imageMethods.create({
                    params: { collectionId },
                    data: { file, name, alt: file.name.split('.')[0], licenseId: data.licenseId, credit: data.credit },
                })
            }
        }
    }),

    /**
     * Reads an image by id.
     */
    read: defineOperation({
        authorizer: () => imageAuthers.read.dynamicFields({}),
        paramsSchema: z.object({
            id: z.number(),
        }),
        operation: async ({ prisma, params: { id } }) => {
            const image = await prisma.image.findUnique({
                where: {
                    id,
                },
            })

            if (!image) throw new ServerError('NOT FOUND', 'Image not found')
            return image
        }
    }),

    /**
     * Reads a page of images in a collection by collectionId.
     */
    readPage: defineOperation({
        authorizer: () => imageAuthers.readPage.dynamicFields({}),
        paramsSchema: readPageInputSchemaObject(
            z.number(),
            z.object({
                id: z.number(),
            }),
            z.object({
                collectionId: z.number(),
            }),
        ),
        operation: async ({ prisma, params }) => {
            const { collectionId } = params.paging.details
            return await prisma.image.findMany({
                where: {
                    collectionId,
                },
                ...cursorPageingSelection(params.paging.page)
            })
        }
    }),

    /**
     * Reads a special image by name (special atr.).
     * In the case that the special image does not exist (bad state) a "bad" image will be created.
     */
    readSpecial: defineOperation({
        authorizer: () => imageAuthers.readSpecial.dynamicFields({}),
        paramsSchema: z.object({
            special: z.nativeEnum(SpecialImage)
        }),
        operation: async ({ prisma, params: { special }, session }) => {
            const image = await prisma.image.findUnique({
                where: {
                    special,
                },
            })

            if (!image) {
                return await createSourceless(
                    { params: { name: special, special }, session }
                )
            }
            return image
        }
    }),

    /**
     * Update a image by id and data. Also can give the image a new license by data.licenseId.
     */
    update: defineOperation({
        authorizer: () => imageAuthers.update.dynamicFields({}),
        paramsSchema: z.object({
            id: z.number(),
        }),
        dataSchema: imageSchemas.update,
        operation: async ({ prisma, params: { id }, data: { licenseId, ...data } }) => {
            console.log('lic', licenseId)
            return await prisma.image.update({
                where: {
                    id,
                },
                data: {
                    license: licenseId !== undefined ? {
                        ...(licenseId ? { connect: { id: licenseId } } : { disconnect: true })
                    } : undefined,
                    ...data,
                }
            })
        }
    }),

    destroy: defineOperation({
        authorizer: () => imageAuthers.destroy.dynamicFields({}),
        paramsSchema: z.object({
            id: z.number(),
        }),
        operation: async ({ prisma, params: { id } }) => {
            const image = await prisma.image.findUnique({
                where: {
                    id,
                },
            })
            if (!image) throw new ServerError('NOT FOUND', `Bilde med id ${id} ikke funnet`)
            if (image.special) throw new ServerError('BAD PARAMETERS', `Bilde med id ${id} er spesielt og kan ikke slettes`)

            //TODO: remove the image from store

            return await prisma.image.delete({
                where: {
                    id,
                },
            })
        }
    }),
}
