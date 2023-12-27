'use server'
import { join } from 'path'
import { writeFile, mkdir } from 'fs/promises'
import prisma from '@/prisma'
import { z } from 'zod'
import { v4 as uuid } from 'uuid'
import { File } from 'buffer'
import errorHandeler from '@/prisma/errorHandler'
import { Image } from '@prisma/client'
import { ActionReturn } from '../type'

export default async function create(collectionId: number, rawdata: FormData): Promise<ActionReturn<Image>> {
    const schema = z.object({
        file: z.instanceof(File).refine((file) => file.size < 1024 * 1024, 'File size must be less than 1mb'),
        name: z.string().max(50).min(2),
        alt: z.string().max(100).min(2),
    })
    const parse = schema.safeParse({
        file: rawdata.get('file'),
        name: rawdata.get('name'),
        alt: rawdata.get('alt'),
    })
    if (!parse.success) {
        return { success: false, error: parse.error.issues }
    }
    const data = parse.data

    const ext = data.file.type.split('/')[1]
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

    const bytes = await data.file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    try {
        const fsLocation = `${uuid()}.${ext}`
        const destination = join('./', 'store', 'images')
        await mkdir(destination, { recursive: true })
        await writeFile(join(destination, fsLocation), buffer)
        const image = await prisma.image.create({
            data: {
                name: data.name,
                alt: data.alt,
                fsLocation,
                ext,
                collection: {
                    connect: {
                        id: collectionId,
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
