import 'server-only'
import { readSpecialImageCollection } from './collections/read'
import { createImageValidation } from './schema'
import { prismaCall } from '@/server/prismaCall'
import { createFile } from '@/server/store/createFile'
import prisma from '@/prisma'
import logger from '@/logger'
import sharp from 'sharp'
import type { CreateImageType } from './schema'
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
}: CreateImageType & { collectionId: number }): Promise<Image> {
    const { file, ...meta } = createImageValidation.detailedValidate(rawdata)
    const allowedExt = ['png', 'jpg', 'jpeg', 'heic']

    const uploadPromises = [
        createOneInStore(file, allowedExt, 250),
        createOneInStore(file, allowedExt, 600),
        createFile(file, 'images', allowedExt),
    ]

    const [smallSize, mediumSize, original] = await Promise.all(uploadPromises)
    const fsLocationSmallSize = smallSize.fsLocation
    const fsLocationMediumSize = mediumSize.fsLocation
    const fsLocation = original.fsLocation
    const ext = original.ext
    return await prismaCall(() => prisma.image.create({
        data: {
            name: meta.name,
            alt: meta.alt,
            fsLocation,
            fsLocationSmallSize,
            fsLocationMediumSize,
            ext,
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
            fsLocation: 'not_found',
            fsLocationMediumSize: 'not_found',
            fsLocationSmallSize: 'not_found',
            ext: 'jpg',
            alt: 'not found',
            collection: {
                connect: {
                    id: standardCollection.id
                }
            }
        },
    }))
}
