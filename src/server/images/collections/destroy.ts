import 'server-only'
import prisma from '@/prisma'
import { createActionError, createPrismaActionError } from '@/actions/error'
import type { ImageCollection } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'

export async function destroyImageCollection(collectionId: number): Promise<ActionReturn<ImageCollection>> {
    try {
        const collection = await prisma.imageCollection.findUnique({
            where: {
                id: collectionId,
            },
        })
        if (!collection) return createActionError('NOT FOUND', 'Collection ikke funnet')
        //only delete if the collection is not special
        if (collection.special) return createActionError('BAD PARAMETERS', 'Kan ikke slette spesielle koleksjoner')

        await prisma.imageCollection.delete({
            where: {
                id: collectionId,
            },
        })
        return { success: true, data: collection }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
