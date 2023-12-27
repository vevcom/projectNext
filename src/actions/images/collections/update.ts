'use server'
import { z } from 'zod'
import prisma from '@/prisma'
import errorHandeler from '@/prisma/errorHandler'
import type { ActionReturn } from '@/actions/type'
import { ImageCollection } from '@prisma/client'

export default async function create(collectionId: number, rawdata: FormData): Promise<ActionReturn<ImageCollection>> {
    const schema = z.object({
        name: z.string().max(40).min(2).trim().optional(),
        description: z.string().max(500).min(2).trim().optional(),
    })
    const parse = schema.safeParse({
        name: rawdata.get('name'),
        description: rawdata.get('description'),
    })

    if (!parse.success) {
        return { success: false, error: parse.error.issues }
    }

    const data = parse.data

    try {
        const collection = await prisma.imageCollection.update({
            where: {
                id: collectionId,
            },
            data,
        })
        return { success: true, data: collection }
    } catch (error) {
        return errorHandeler(error)
    }
}