'use server'
import { join } from 'path'
import { writeFile, mkdir } from 'fs/promises'
import prisma from '@/prisma'
import { z } from 'zod'
import { v4 as uuid } from 'uuid'
import { File } from 'buffer'
import errorHandeler from '@/prisma/errorHandler'
import type { Image } from '@prisma/client'
import { ActionReturn } from '../type'

export default async function create(collectionId: number, rawdata: FormData): Promise<ActionReturn<Image>> {
    const schema = z.object({
        file: z.instanceof(File).refine((file) => file.size < 1024 * 1024, 'File size must be less than 1mb'),
        name: z.string().max(50, 'max length in 50').min(2, 'min length is 2'),
        alt: z.string().max(100, 'max length in 50').min(2, 'min length is 2'),
    })
    const parse = schema.safeParse({
        file: rawdata.get('file'),
        name: rawdata.get('name'),
        alt: rawdata.get('alt'),
    })
    if (!parse.success) return { success: false, error: parse.error.issues }
    const {file, ...data } = parse.data
    return await createOne(file, { ...data, collectionId })
}

export async function createMany(collectionId: number, rawdata: FormData): Promise<ActionReturn<Image[]>> {
    const schema = z.object({
        files: z.array(z.instanceof(File)).refine((files) => files.every((file) => file.size < 1024 * 1024), 'File size must be less than 1mb'),
    }).refine((data) => data.files.length < 100, 'Max 100 files').refine((data) => data.files.length > 0, 'You must add a file!')
    const parse = schema.safeParse({
        files: rawdata.getAll('files'),
    })

    if (!parse.success) return { success: false, error: parse.error.issues }

    const data = parse.data

    let finalReturn : ActionReturn<Image[]> = { success: true, error: [], data: [] }
    for (const file of data.files) {
        const ret = await createOne(file, {name: file.name.split('.')[0], alt: file.name, collectionId})
        finalReturn  = {
            success: ret.success,
            error: ret.error,
        }
        if (ret.data) finalReturn.data?.push(ret.data)
        if (!finalReturn.success) return finalReturn
    }
    return finalReturn
}

async function createOne(file: File, meta: Omit<Image, 'fsLocation' | 'ext' | 'id'>) : Promise<ActionReturn<Image>> {
    const ext = file.type.split('/')[1]
    if (!['png', 'jpg', 'jpeg'].includes(ext)) {
        return {
            success: false, error: [
                {
                    path: ['file'],
                    message: 'Invalid file type'
                }
            ]
        }
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    try {
        const fsLocation = `${uuid()}.${ext}`
        const destination = join('./', 'public', 'store', 'images')
        await mkdir(destination, { recursive: true })
        await writeFile(join(destination, fsLocation), buffer)
        const image = await prisma.image.create({
            data: {
                name: meta.name,
                alt: meta.alt,
                fsLocation,
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
        return errorHandeler(err)
    }
}
