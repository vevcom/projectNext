'use server'
import { createImageSchema, createImagesSchema } from './schema'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import createFile from '@/store/createFile'
import sharp from 'sharp'
import type { CreateImageSchemaType, CreateImagesSchemaType } from './schema'
import type { ActionReturn } from '@/actions/Types'
import type { Image } from '@prisma/client'

async function createOneInStore(file: File, allowedExt: string[], size: number) {
    const ret = await createFile(file, 'images', allowedExt, async (buffer) => await sharp(buffer).resize(size, size, {
        fit: sharp.fit.inside,
        withoutEnlargement: true
    }).toBuffer())
    return ret
}

export async function createOneImage(file: File, meta: {
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
            if (!image) return { success: false }
            return { success: true, data: image }
        } catch (err) {
            return errorHandler(err)
        }
    } catch (err) {
        //LOGGER
        return {
            success: false,
            error: [{ path: ['file'], message: 'Failed to create small size image' }]
        }
    }
}

export async function createImage(
    collectionId: number,
    rawdata: FormData | CreateImageSchemaType
): Promise<ActionReturn<Image>> {
    const parse = createImageSchema.safeParse(rawdata)
    if (!parse.success) return { success: false, error: parse.error.issues }
    const { file, ...data } = parse.data
    return await createOneImage(file, { ...data, collectionId })
}

export async function createImages(
    collectionId: number,
    rawdata: FormData | CreateImagesSchemaType
): Promise<ActionReturn<Image[]>> {
    const parse = createImagesSchema.safeParse(rawdata)

    if (!parse.success) return { success: false, error: parse.error.issues }

    const data = parse.data

    let finalReturn: ActionReturn<Image[]> = { success: true, data: [] }
    for (const file of data.files) {
        const ret = await createOneImage(file, { name: file.name.split('.')[0], alt: file.name.split('.')[0], collectionId })
        if (!ret.success) return ret
        finalReturn = {
            ...finalReturn,
            success: ret.success,
        }
        finalReturn.data.push(ret.data)
    }
    return finalReturn
}
