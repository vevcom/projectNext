'use server'
import type { Image } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import { destroyImage } from '@/server/images/destroy'

export async function destroyImageAction(imageId: number): Promise<ActionReturn<Image>> {
    //TODO: add auth
    return await destroyImage(imageId)
}
