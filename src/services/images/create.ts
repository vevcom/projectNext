import 'server-only'
import { readSpecialImageCollection } from './collections/read'
import { createImageValidation } from './validation'
import { allowedExtImageUpload, avifOptions, imageSizes } from './ConfigVars'
import { prismaCall } from '@/services/prismaCall'
import { createFile } from '@/services/store/createFile'
import prisma from '@/prisma'
import logger from '@/lib/logger'
import sharp from 'sharp'
import type { CreateImageTypes } from './validation'
import type { Image, SpecialImage } from '@prisma/client'

/**
 * Creates one image from a file (creates all the types of resolutions and stores them)
 * @param file - The file to create the image from
 * @param meta - The metadata for the image for the db
 * @returns
 */
export async function createImage({
    collectionId,
    ...rawdata
}: CreateImageTypes['Detailed'] & { collectionId: number }): Promise<Image> {
    const { file, ...meta } = createImageValidation.detailedValidate(rawdata)

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
    return await prismaCall(() => prisma.image.create({
        data: {
            name: meta.name,
            alt: meta.alt,
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
    }))
}

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

/**
 * WARNING: This function should only be used in extreme cases
 * Creats  bad image this should really only happen in worst case scenario
 * Ads it to the standard collection
 * @param name - the name of the image
 * @param config - the config for the image (special)
 */
export async function createBadImage(name: string, config: {
    special: SpecialImage
}): Promise<Image> {
    const standardCollection = await readSpecialImageCollection('STANDARDIMAGES')
    logger.warn('creating a bad image, this should only happen in extreme cases.')
    return await prismaCall(() => prisma.image.create({
        data: {
            name,
            special: config.special,
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
    }))
}
