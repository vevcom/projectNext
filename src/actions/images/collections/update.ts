'use server'
import prisma from '@/prisma'
import { createPrismaActionError, createZodActionError } from '@/actions/error'
import { z } from 'zod'
import type { ImageCollection } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'

export async function updateImageCollection(
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
        return createZodActionError(parse)
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
        return createPrismaActionError(error)
    }
}
