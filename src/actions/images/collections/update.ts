'use server'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import { z } from 'zod'
import { ImageCollection } from '@prisma/client'
import type { ActionReturn } from '@/actions/type'

export default async function update(
    collectionId: number,
    coverImageId: number | undefined,
    rawdata: FormData
): Promise<ActionReturn<ImageCollection>> {
    const schema = z.object({
        name: z.string().max(40).min(2).trim()
            .or(z.literal('')),
        description: z.string().max(500).min(2).trim()
            .or(z.literal('')),
    }).transform(data => ({
        name: data.name || undefined,
        description: data.description || undefined,
    }))
    const parse = schema.safeParse({
        name: rawdata.get('name'),
        description: rawdata.get('description'),
    })

    if (!parse.success) {
        return { success: false, error: parse.error.issues }
    }
    const data = {
        ...parse.data,
        coverImage: coverImageId ? {
            connect: {
                id: coverImageId
            }
        } : undefined
    }

    try {
        const collection = await prisma.imageCollection.update({
            where: {
                id: collectionId,
            },
            data
        })
        return { success: true, data: collection }
    } catch (error) {
        return errorHandler(error)
    }
}
