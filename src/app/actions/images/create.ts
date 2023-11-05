'use server'
import { join } from 'path'
import { writeFile } from 'fs/promises'
import prisma from '@/prisma'
import { z } from 'zod'
import { v4 as uuid } from 'uuid'
import { File } from 'buffer'

export default async function create(rawdata: FormData) {
    const schema = z.object({
        file: z.instanceof(File).refine((file) => file.size < 1024 * 1024, 'File size must be less than 1mb'),
        name: z.string(),
    })
    const data = schema.parse({
        file: rawdata.get('file'),
        name: rawdata.get('name'),
    })

    const bytes = await data.file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const image = await prisma.image.create({
        data: {
            name: data.name,
            fsLocation: uuid(),
        }
    }).catch(err => {
        console.log(err)
    })
    if (!image) return { success: false }

    await writeFile(join(__dirname, 'images', image.fsLocation), buffer)
    return { success: true }
}
