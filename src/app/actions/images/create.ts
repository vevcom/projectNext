'use server'
import { join } from 'path'
import { writeFile } from "fs/promises"
import prisma from "@/prisma"
import { z } from 'zod' 
import { v4 as uuid } from 'uuid'

export default async function create(rawdata: FormData) {
    const schema = z.object({
        file: z.instanceof(File),
        name: z.string(),
    })
    let data
    try {
        data = schema.parse(rawdata)
    } catch {
        return { success: false, error: 'Invalid data'}
    }

    const bytes = await data.file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const image = await prisma.image.create({
        data: {
            name: data.name,
            fsLocation: uuid(),
        }
    })

    await writeFile(join('/', 'images', image.fsLocation), buffer)

    return { success: true }
}
