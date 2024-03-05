'use server'
import { updateImageCollectionSchema } from './schema'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { ImageCollection } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import type { UpdateImageCollectionSchemaType } from './schema'

export async function updateImageCollection(
    collectionId: number,
    coverImageId: number | undefined,
    rawdata: FormData | UpdateImageCollectionSchemaType
): Promise<ActionReturn<ImageCollection>> {
    const parse = updateImageCollectionSchema.safeParse(rawdata)

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
