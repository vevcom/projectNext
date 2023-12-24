'use server'
import { z } from 'zod'
import prisma from '@/prisma'

export default async function create(rawdata: FormData) {
    const schema = z.object({
        name: z.string().max(40).min(2).trim(),
        description: z.string().max(500).min(2).trim(),
    })
    const parse = schema.safeParse({
        name: rawdata.get('name'),
        alt: rawdata.get('alt'),
    })
    if (!parse.success) {
        return { success: false, error: parse.error.issues }
    }
    const data = parse.data

    const collection = await prisma.imageCollection.create({
        data: {
            name: data.name,
            description: data.description,
        }
    })

    return { success: true, data: collection }
}