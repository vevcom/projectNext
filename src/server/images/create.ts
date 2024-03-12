import 'server-only'
import type { ActionReturn } from '@/actions/Types'
import createFile from '@/server/store/createFile'
import sharp from 'sharp'
import type { Image } from '@prisma/client'
import { createPrismaActionError, createActionError } from '@/actions/error'

/**
 * Creates one image from a file (creates all the types of resolutions and stores them)
 * @param file - The file to create the image from
 * @param meta - The metadata for the image for the db
 * @returns 
 */
export async function createImage(file: File, meta: {
    name: string,
    alt: string,
    collectionId: number,
}): Promise<ActionReturn<Image>> {
    const allowedExt = ['png', 'jpg', 'jpeg', 'heic']

    const uploadPromises = [
        createOneInStore(file, allowedExt, 250),
        createOneInStore(file, allowedExt, 600),
        createFile(file, 'images', allowedExt),
    ]

    const [smallSize, mediumSize, original] = await Promise.all(uploadPromises)
    if (!smallSize.success) return smallSize
    const fsLocationSmallSize = smallSize.data.fsLocation
    if (!mediumSize.success) return mediumSize
    const fsLocationMediumSize = mediumSize.data.fsLocation
    if (!original.success) return original
    const fsLocation = original.data.fsLocation
    const ext = original.data.ext

    try {
        try {
            const image = await prisma.image.create({
                data: {
                    name: meta.name,
                    alt: meta.alt,
                    fsLocation,
                    fsLocationSmallSize,
                    fsLocationMediumSize,
                    ext,
                    collection: {
                        connect: {
                            id: meta.collectionId,
                        }
                    }
                }
            })

            return { success: true, data: image }
        } catch (err) {
            return createPrismaActionError(err)
        }
    } catch (err) {
        return createActionError('UNKNOWN ERROR', [{ path: ['file'], message: 'Failed to create small size image' }])
    }
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