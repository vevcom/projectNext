'use server'
import { z } from 'zod'
import { File } from 'buffer'
import errorHandeler from '@/prisma/errorHandler'
import { writeFile, unlink } from 'fs/promises'
import { join } from 'path'
import { v4 as uuid } from 'uuid'
import prisma from '@/prisma'

export default async function create(oldName: string, rawdata: FormData) {
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

    //user does not change file
    if (data.file.name === 'undefined') {
        console.error('jfieijfeiwfjioejf')
        await prisma.image.update({
            where: {
                name: oldName
            },
            data: {
                name: data.name,
                alt: data.alt,
            },
        })
        return { success: true }
    }

    //user changes file
    const ext = data.file.type.split('/')[1]
    if (!['png', 'jpg', 'jpeg'].includes(ext)) return { success: false, error: 'Invalid file type' }

    const bytes = await data.file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    try {
        const oldImage = await prisma.image.findUnique({
            where: {
                name: oldName
            }
        })
        if (!oldImage) return { success: false, error: 'image did not exist' }
        unlink(join('./', 'store', 'images', oldImage.fsLocation))

        const fsLocation = `${uuid()}.${ext}`
        const destination = join('./', 'store', 'images')
        await writeFile(join(destination, fsLocation), buffer)

        const image = await prisma.image.update({
            where: {
                name: oldName
            },
            data: {
                name: data.name,
                alt: data.alt,
                fsLocation
            },
        })
        if (!image) return { success: false }
        return { success: true }
    } catch (err) {
        return errorHandeler(err)
    }
}
