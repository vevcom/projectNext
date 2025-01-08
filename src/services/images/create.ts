import 'server-only'
import { readSpecialImageCollection } from './collections/read'
import { createImagesValidation, createImageValidation } from './validation'
import { allowedExtImageUpload, avifOptions, imageSizes } from './ConfigVars'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import { createFile } from '@/services/store/createFile'
import logger from '@/lib/logger'
import sharp from 'sharp'
import type { SpecialImage } from '@prisma/client'

/**
 * Creates an image.
 * The method will resize the image to the correct sizes and save it to the store.
 * It will also save the original image to the store.
 * All images are saved as avif (except the original).
 * @param collectionId - The id of the collection to add the image to
 */
export const create = ServiceMethodHandler({
    withData: true,
    validation: createImageValidation,
    handler: async (prisma, { collectionId }: { collectionId: number }, data) => {
        const { file, ...meta } = data
        const buffer = Buffer.from(await file.arrayBuffer())
        const avifBuffer = await sharp(buffer).toFormat('avif').avif(avifOptions).toBuffer()
        const avifFile = new File([avifBuffer], 'image.avif', { type: 'image/avif' })

        const uploadPromises = [
            createOneInStore(avifFile, ['avif'], imageSizes.small),
            createOneInStore(avifFile, ['avif'], imageSizes.medium),
            createOneInStore(avifFile, ['avif'], imageSizes.large),
            createFile(file, 'images', [...allowedExtImageUpload]),
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
export const createMany = ServiceMethodHandler({
    withData: true,
    validation: createImagesValidation,
    handler: async (
        prisma,
        { useFileName, collectionId }: { useFileName: boolean, collectionId: number },
        data,
        session
    ) => {
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
 * WARNING: This function should only be used in extreme cases
 * Creats  bad image this should really only happen in worst case scenario
 * Ads it to the standard collection
 * @param name - the name of the image
 * @param config - the config for the image (special)
 */
export const createBad = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, { name, special }: { name: string, special: SpecialImage }) => {
        const standardCollection = await readSpecialImageCollection('STANDARDIMAGES')
        logger.warn('creating a bad image, this should only happen in extreme cases.')
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

