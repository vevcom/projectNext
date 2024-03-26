'use server'
import { destroyImageCollection } from '@/server/images/collections/destroy'
import { safeServerCall } from '@/actions/safeServerCall'
import type { ImageCollection } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'

export async function destroyImageCollectionAction(collectionId: number): Promise<ActionReturn<ImageCollection>> {
    //TODO: Visibility check
    
    return await safeServerCall(() => destroyImageCollection(collectionId))
}
