'use server'
import { join } from 'path'
import { writeFile } from "fs/promises"
import prisma from "@/prisma"
export default async function create(data: FormData) {
    const file = data.get('file') as File | null
    if (!file) {
        throw new Error('no image uploaded')
    }
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const image = await prisma.image.create({})

    await writeFile(join('/', 'images', image.fsLocation), buffer)

    return { success: true }
}
