'use server'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import { z } from 'zod'
import type { Image } from '@prisma/client'
import type { ActionReturn } from '@/actions/type'

export async function updateImage(imageId: number, rawdata: FormData): Promise<ActionReturn<Image>> {
    const schema = z.object({
        name: z.string().max(50, 'max length in 50').min(2, 'min length is 2').trim()
            .or(z.literal('')),
        alt: z.string().max(100, 'max length in 50').min(2, 'min length is 2').trim()
            .or(z.literal('')),
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
        const image = await prisma.image.update({
            where: {
                id: imageId,
            },
            data
        })
        return { success: true, data: image }
    } catch (error) {
        return errorHandler(error)
    }
}
