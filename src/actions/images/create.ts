'use server'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import { v4 as uuid } from 'uuid'
import sharp from 'sharp'
import { join } from 'path'
import { writeFile, mkdir } from 'fs/promises'
import { File } from 'buffer'
import type { ActionReturn } from '@/actions/Types'
import type { Image } from '@prisma/client'
import { createImageSchema, createImagesSchema } from './schema'
import type { CreateImageSchemaType, CreateImagesSchemaType } from './schema'

async function createOne(file: File, meta: {
    name: string,
    alt: string,
    collectionId: number,
}): Promise<ActionReturn<Image>> {
    const ext = file.type.split('/')[1]
    if (!['png', 'jpg', 'jpeg', 'heic'].includes(ext)) {
        return {
            success: false, error: [
                {
                    path: ['file'],
                    message: 'Invalid file type'
                }
            ]
        }
    }

    const arrBuffer = await file.arrayBuffer()

    const buffer = Buffer.from(arrBuffer)

    try {
        const fsLocation = `${uuid()}.${ext}`
        const destination = join('store', 'images')
        await mkdir(destination, { recursive: true })
        await writeFile(join(destination, fsLocation), buffer)

        const smallsize = await sharp(buffer).resize(250, 250, {
            fit: sharp.fit.inside,
            withoutEnlargement: true
        }).toBuffer() // Adjust the size as needed
        const fsLocationSmallSize = `${uuid()}.${ext}`
        await writeFile(join(destination, fsLocationSmallSize), smallsize)

        const mediumSize = await sharp(buffer).resize(600, 600, {
            fit: sharp.fit.inside,
            withoutEnlargement: true
        }).toBuffer() // Adjust the size as needed
        const fsLocationMediumSize = `${uuid()}.${ext}`
        await writeFile(join(destination, fsLocationMediumSize), mediumSize)

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

export async function createImage(collectionId: number, rawdata: FormData | CreateImageSchemaType): Promise<ActionReturn<Image>> {
    const parse = createImageSchema.safeParse(rawdata)

    if (!parse.success) return { success: false, error: parse.error.issues }
    const { file, ...data } = parse.data
    return await createOne(file, { ...data, collectionId })
}

export async function createImages(collectionId: number, rawdata: FormData | CreateImagesSchemaType): Promise<ActionReturn<Image[]>> {
    const parse = createImagesSchema.safeParse(rawdata)

    if (!parse.success) return { success: false, error: parse.error.issues }

    const data = parse.data

    let finalReturn: ActionReturn<Image[]> = { success: true, data: [] }
    for (const file of data.files) {
        const ret = await createOne(file, { name: file.name.split('.')[0], alt: file.name.split('.')[0], collectionId })
        if (!ret.success) return ret
        finalReturn = {
            ...finalReturn,
            success: ret.success,
        }
        finalReturn.data.push(ret.data)
    }
    return finalReturn
}
