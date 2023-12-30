'use server'
import { z } from 'zod'
import type { Image } from '@prisma/client'
import { ActionReturn } from '../type'
import prisma from '@/prisma'
import errorHandeler from '@/prisma/errorHandler'

export default async function update(imageId: number, rawdata: FormData): Promise<ActionReturn<Image>> {
    const schema = z.object({
        name: z.string().max(50, 'max length in 50').min(2, 'min length is 2').trim().or(z.literal('')),
        alt: z.string().max(100, 'max length in 50').min(2, 'min length is 2').trim().or(z.literal('')),
    }).transform(data => ({
        name: data.name || undefined,
        alt: data.alt || undefined,
    }))
    const parse = schema.safeParse({
        file: rawdata.get('file'),
        name: rawdata.get('name'),
        alt: rawdata.get('alt'),
    })
    if (!parse.success) return { success: false, error: parse.error.issues }
    const data = parse.data
    try {
        const collection = await prisma.image.update({
            where: {
                id: imageId,
            },
            data
        })
        return { success: true, data: collection }
    } catch (error) {
        return errorHandeler(error)
    }
}