'use server'
import { destroyImage } from '@/server/images/destroy'
import type { Image } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import { safeServerCall } from '../safeServerCall'

export async function destroyImageAction(imageId: number): Promise<ActionReturn<Image>> {
    //TODO: add auth
    return await safeServerCall(() => destroyImage(imageId))
}
