import 'server-only'
import prisma from '@/prisma'
import { ServerError } from '@/server/error'
import { prismaCall } from '@/server/prismaCall'
import type { ImageCollection } from '@prisma/client'

export async function destroyImageCollection(collectionId: number): Promise<ImageCollection> {
    const collection = await prismaCall(() => prisma.imageCollection.findUnique({
        where: {
            id: collectionId,
        },
    }))
    if (!collection) throw new ServerError('NOT FOUND', 'Collection ikke funnet')
    //only delete if the collection is not special
    if (collection.special) throw new ServerError('BAD PARAMETERS', 'Kan ikke slette spesielle koleksjoner')

    await prismaCall(() => prisma.imageCollection.delete({
        where: {
            id: collectionId,
        },
    }))

    //The visibility is "owned" by the collection, so we can delete it here
    await prismaCall(() => prisma.visibility.delete({
        where: {
            id: collection.visibilityId,
        },
    }))
    return collection
}
