import '@pn-server-only'
import { prisma } from '@/prisma-pn-client-instance'
import { ServerError } from '@/services/error'
import { prismaCall } from '@/services/prismaCall'
import { visibilityOperations } from '@/services/visibility/operations'
import type { ImageCollection } from '@/prisma-generated-pn-types'

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

    await visibilityOperations.destroy({ params: { visibilityId: collection.visibilityAdminId }, bypassAuth: true })
    await visibilityOperations.destroy({ params: { visibilityId: collection.visibilityReadId }, bypassAuth: true })
    return collection
}
