'use server'
import { destroyImageCollection } from '@/server/images/collections/destroy'
import type { ImageCollection } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import { safeServerCall } from '@/actions/safeServerCall'

export async function destroyImageCollectionAction(collectionId: number): Promise<ActionReturn<ImageCollection>> {
    return await safeServerCall(() => destroyImageCollection(collectionId))
}
