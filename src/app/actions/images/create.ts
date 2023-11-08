'use server'
import { join } from 'path'
import { writeFile, mkdir } from 'fs/promises'
import prisma from '@/prisma'
import { z } from 'zod'
import { v4 as uuid } from 'uuid'
import { File } from 'buffer'

export default async function create(rawdata: FormData) {
    const schema = z.object({
        file: z.instanceof(File).refine((file) => file.size < 1024 * 1024, 'File size must be less than 1mb'),
        name: z.string().max(50).min(2),
        alt: z.string().max(100).min(2),
    })
    const data = schema.parse({
        file: rawdata.get('file'),
        name: rawdata.get('name'),
        alt: rawdata.get('alt'),
    })

    const ext = data.file.type.split('/')[1]
    if (!['png', 'jpg', 'jpeg'].includes(ext)) return { success: false, error: 'Invalid file type' }

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
            }
        })
        if (!image) return { success: false }
        return { success: true }
    } catch (err) {
        console.error(err)
        //stor sjangs for at dette er en duplicate name field error.
        return { success: false }
    }
}
