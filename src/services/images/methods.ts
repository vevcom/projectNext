import 'server-only'
import { readSpecialImageCollection } from './collections/read'
import { ImageConfig } from './config'
import { ImageAuthers } from './authers'
import { ImageSchemas } from './schemas'
import { ServerError } from '@/services/error'
import { createFile } from '@/services/store/createFile'
import logger from '@/lib/logger'
import { ServiceMethod } from '@/services/ServiceMethod'
import { readPageInputSchemaObject } from '@/lib/paging/schema'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import sharp from 'sharp'
import { SpecialImage } from '@prisma/client'
import { z } from 'zod'


export namespace ImageMethods {
    /**
     * Creates an image.
     * The method will resize the image to the correct sizes and save it to the store.
     * It will also save the original image to the store.
     * All images are saved as avif (except the original).
     * @param collectionId - The id of the collection to add the image to
     */
    export const create = ServiceMethod({
        auther: () => ImageAuthers.create.dynamicFields({}),
        paramsSchema: z.object({
            collectionId: z.number(),
        }),
        dataSchema: ImageSchemas.create,
        method: async ({ prisma, params: { collectionId }, data }) => {
            const { file, ...meta } = data
            const buffer = Buffer.from(await file.arrayBuffer())
            const avifBuffer = await sharp(buffer).toFormat('avif').avif(ImageConfig.avifConvertionOptions).toBuffer()
            const avifFile = new File([avifBuffer], 'image.avif', { type: 'image/avif' })

            const uploadPromises = [
                createOneInStore(avifFile, ['avif'], ImageConfig.sizes.small),
                createOneInStore(avifFile, ['avif'], ImageConfig.sizes.medium),
                createOneInStore(avifFile, ['avif'], ImageConfig.sizes.large),
                createFile(file, 'images', [...ImageConfig.allowedExtUpload]),
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
    })
    /**
     * Creates many images from files.
     * The method will resize the images to the correct sizes and save them to the store.
     */
    export const createMany = ServiceMethod({
        auther: () => ImageAuthers.createMany.dynamicFields({}),
        paramsSchema: z.object({
            useFileName: z.boolean(),
            collectionId: z.number(),
        }),
        dataSchema: ImageSchemas.createMany,
        method: async ({
            prisma,
            params: { useFileName, collectionId },
            data,
            session,
        }) => {
            for (const file of data.files) {
                const name = useFileName ? file.name.split('.')[0] : undefined
                await create.client(prisma).execute({
                    params: { collectionId },
                    data: { file, name, alt: file.name.split('.')[0], licenseId: data.licenseId, credit: data.credit },
                    session
                })
            }
        }
    })

    /**
     * WARNING: This function should only be used in extreme cases, Therefore it is not exported.
     * Creates bad image this should really only happen in worst case scenario
     * where the server has lost a image and needs to be replaced with a bad image.
     * A bad image is an image that has no correct fsLocation attributes.
     * @param name - the name of the image
     * @param config - the config for the image (special)
     */
    const createSourceless = ServiceMethod({
        auther: () => ImageAuthers.createSourcelessImage.dynamicFields({}),
        paramsSchema: z.object({
            name: z.string(),
            special: z.nativeEnum(SpecialImage),
        }),
        method: async ({ prisma, params: { name, special } }) => {
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

    /**
     * Reads an image by id.
     */
    export const read = ServiceMethod({
        auther: () => ImageAuthers.read.dynamicFields({}),
        paramsSchema: z.object({
            id: z.number(),
        }),
        method: async ({ prisma, params: { id } }) => {
            const image = await prisma.image.findUnique({
                where: {
                    id,
                },
            })

            if (!image) throw new ServerError('NOT FOUND', 'Image not found')
            return image
        }
    })

    /**
     * Reads a page of images in a collection by collectionId.
     */
    export const readPage = ServiceMethod({
        auther: () => ImageAuthers.readPage.dynamicFields({}),
        paramsSchema: readPageInputSchemaObject(
            z.number(),
            z.object({
                id: z.number(),
            }),
            z.object({
                collectionId: z.number(),
            }),
        ),
        method: async ({ prisma, params }) => {
            const { collectionId } = params.paging.details
            return await prisma.image.findMany({
                where: {
                    collectionId,
                },
                ...cursorPageingSelection(params.paging.page)
            })
        }
    })

    /**
     * Reads a special image by name (special atr.).
     * In the case that the special image does not exist (bad state) a "bad" image will be created.
     */
    export const readSpecial = ServiceMethod({
        auther: () => ImageAuthers.readSpecial.dynamicFields({}),
        paramsSchema: z.object({
            special: z.nativeEnum(SpecialImage)
        }),
        method: async ({ prisma, params: { special }, session }) => {
            const image = await prisma.image.findUnique({
                where: {
                    special,
                },
            })

            if (!image) {
                return await createSourceless.client(prisma).execute(
                    { params: { name: special, special }, session }
                )
            }
            return image
        }
    })

    /**
     * Update a image by id and data. Also can give the image a new license by data.licenseId.
     */
    export const update = ServiceMethod({
        auther: () => ImageAuthers.update.dynamicFields({}),
        paramsSchema: z.object({
            id: z.number(),
        }),
        dataSchema: ImageSchemas.update,
        method: async ({ prisma, params: { id }, data }) => await prisma.image.update({
            where: {
                id,
            },
            data: {
                license: data.licenseId ? { connect: { id: data.licenseId } } : undefined,
                ...data,
            }
        })
    })

    export const destroy = ServiceMethod({
        auther: () => ImageAuthers.destroy.dynamicFields({}),
        paramsSchema: z.object({
            id: z.number(),
        }),
        method: async ({ prisma, params: { id } }) => {
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
    })

    /**
     * Creates one image from a file.
     * @param file - The file to create the image from
     * @param allowedExt - The allowed extensions for the file
     * @param size - The size to resize the image to
     * @returns
     */
    export async function createOneInStore(file: File, allowedExt: string[], size: number) {
        const ret = await createFile(file, 'images', allowedExt, async (buffer) => await sharp(buffer).resize(size, size, {
            fit: sharp.fit.inside,
            withoutEnlargement: true
        }).toBuffer())
        return ret
    }
}
