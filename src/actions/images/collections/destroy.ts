'use server'
import type { ImageCollection } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import { destroyImageCollection } from '@/server/images/collections/destroy'

export async function destroyImageCollectionAction(collectionId: number): Promise<ActionReturn<ImageCollection>> {
    return await destroyImageCollection(collectionId)
}
