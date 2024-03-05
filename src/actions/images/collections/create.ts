'use server'
import prisma from '@/prisma'
import { createPrismaActionError, createZodActionError } from '@/actions/error'
import { z } from 'zod'
import type { ImageCollection } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'

export async function createImageCollection(rawdata: FormData): Promise<ActionReturn<ImageCollection>> {
    const schema = z.object({
        name: z.string().max(40).min(2).trim(),
        description: z.string().max(500).min(2).trim(),
    })
    const parse = schema.safeParse({
        name: rawdata.get('name'),
        description: rawdata.get('description'),
    })
    if (!parse.success) {
        return createZodActionError(parse)
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
        return createPrismaActionError(error)
    }
}
