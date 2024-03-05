'use server'
import prisma from '@/prisma'
import { createPrismaActionError } from '@/actions/error'
import type { ImageCollection } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'

export async function destroyImageCollection(collectionId: number): Promise<ActionReturn<ImageCollection>> {
    try {
        const collection = await prisma.imageCollection.delete({
            where: {
                id: collectionId,
            },
        })
        return { success: true, data: collection }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
