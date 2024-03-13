'use server'
import { updateCmsImage, updateCmsImageConfig } from '@/server/cms/images/update'
import type { ActionReturn } from '@/actions/Types'
import type { CmsImage, ImageSize } from '@prisma/client'

export async function updateCmsImageAction(cmsImageId: number, imageId: number): Promise<ActionReturn<CmsImage>> {
    //TODO: Auth on visibility (or permission if special)
    return await updateCmsImage(cmsImageId, imageId)
}

export async function updateCmsImageConfigAction(
    cmsImageId: number,
    config: {imageSize: ImageSize}
): Promise<ActionReturn<CmsImage>> {
    //TODO: Auth on visibility (or permission if special)
    return await updateCmsImageConfig(cmsImageId, config)
}
