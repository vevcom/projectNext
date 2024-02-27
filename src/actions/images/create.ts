'use server'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import { z } from 'zod'
import { v4 as uuid } from 'uuid'
import sharp from 'sharp'
import { join } from 'path'
import { writeFile, mkdir } from 'fs/promises'
import type { ActionReturn } from '@/actions/Types'
import type { Image } from '@prisma/client'
import createFile from '@/store/createFile'

const maxFileSize = 10 * 1024 * 1024 // 10mb


async function createOne(file: File, meta: {
    name: string,
    alt: string,
    collectionId: number,
}): Promise<ActionReturn<Image>> {
    const allowedExt = ['png', 'jpg', 'jpeg', 'heic']

    const smallRes = await createFile(file, 'images', allowedExt, async (buffer) => {
        return await sharp(buffer).resize(250, 250, {
            fit: sharp.fit.inside,
            withoutEnlargement: true
        }).toBuffer()
    })
    if (!smallRes.success) return smallRes
    const fsLocationSmallSize = smallRes.data.fsLocation

    const mediumRes = await createFile(file, 'images', allowedExt, async (buffer) => {
        return await sharp(buffer).resize(500, 500, {
            fit: sharp.fit.inside,
            withoutEnlargement: true
        }).toBuffer()
    })
    if (!mediumRes.success) return mediumRes
    const fsLocationMediumSize = mediumRes.data.fsLocation

    const ret = await createFile(file, 'images', allowedExt)
    if (!ret.success) return ret
    const fsLocation = ret.data.fsLocation

    const ext = ret.data.ext

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

export async function createImage(collectionId: number, rawdata: FormData): Promise<ActionReturn<Image>> {
    const schema = z.object({
        file: z.instanceof(File).refine(file => file.size < maxFileSize, 'File size must be less than 10mb'),
        name: z.string().max(50, 'max length in 50').min(2, 'min length is 2'),
        alt: z.string().max(100, 'max length in 50').min(2, 'min length is 2'),
    })
    const parse = schema.safeParse({
        file: rawdata.get('file'),
        name: rawdata.get('name'),
        alt: rawdata.get('alt'),
    })
    if (!parse.success) return { success: false, error: parse.error.issues }
    const { file, ...data } = parse.data
    return await createOne(file, { ...data, collectionId })
}

export async function createImages(collectionId: number, rawdata: FormData): Promise<ActionReturn<Image[]>> {
    const schema = z.object({
        files: z.array(z.instanceof(File)).refine(
            files => files.every(file => file.size < maxFileSize),
            'File size must be less than 10mb'
        ),
    }).refine(
        data => data.files.length < 100,
        'Max 100 files')
        .refine(
            data => data.files.length > 0,
            'You must add a file!'
        )

    const parse = schema.safeParse({
        files: rawdata.getAll('files'),
    })

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
