'use server'
import { createCmsImage } from '@/server/cms/images/create'
import { safeServerCall } from '@/actions/safeServerCall'
import type { Image } from '@prisma/client'
import type { ExpandedCmsImage } from '@/cms/images/Types'
import type { ActionReturn } from '@/actions/Types'

export async function createCmsImageAction(name: string, image?: Image): Promise<ActionReturn<ExpandedCmsImage>> {
    //TODO: Auth route (very few people should be able to create stand alone cmsImages...)
    return await safeServerCall(() => createCmsImage(name, {}, image))
}
