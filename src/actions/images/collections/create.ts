'use server'
import { createImageCollectionSchema } from './schema'
import prisma from '@/prisma'
import { createPrismaActionError, createZodActionError } from '@/actions/error'
import type { ImageCollection } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import type { CreateImageCollectionSchemaType } from './schema'

export async function createImageCollection(
    rawdata: FormData | CreateImageCollectionSchemaType
): Promise<ActionReturn<ImageCollection>> {
    const parse = createImageCollectionSchema.safeParse(rawdata)

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
