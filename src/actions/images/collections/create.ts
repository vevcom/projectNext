'use server'
import { z } from 'zod'
import prisma from '@/prisma'
import errorHandeler from '@/prisma/errorHandler'

export default async function create(rawdata: FormData) {
    const schema = z.object({
        name: z.string().max(40).min(2).trim(),
        description: z.string().max(500).min(2).trim(),
    })
    const parse = schema.safeParse({
        name: rawdata.get('name'),
        description: rawdata.get('description'),
    })
    if (!parse.success) {
        return { success: false, error: parse.error.message }
    }
    const data = parse.data

    try {
        const collection = await prisma.imageCollection.create({
            data: {
                name: data.name,
                description: data.description,
            }
        })
        return { success: true, data: collection }
    
    } catch (error) {
        return errorHandeler(error)
    }
}