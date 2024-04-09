'use server'
import { createActionError } from '@/actions/error'
import { readCmsImage, readSpecialCmsImage } from '@/server/cms/images/read'
import { createCmsImage } from '@/server/cms/images/create'
import { safeServerCall } from '@/actions/safeServerCall'
import { SpecialCmsImage } from '@prisma/client'
import type { ExpandedCmsImage } from '@/cms/images/Types'
import type { ActionReturn } from '@/actions/Types'

/**
 * A action to read a cms image including the image associated with it
 * @param name - name of the cms image the image
 * @returns
 */
export async function readCmsImageAction(name: string): Promise<ActionReturn<ExpandedCmsImage>> {
    //TODO: auth on visibilty
    return await safeServerCall(() => readCmsImage(name))
}

/**
 * Action to reads a special cmsImage, if it does not exist it creates it
 * @param special SpecialCmsImage
 * @returns ActionReturn<ExpandedCmsImage>
 */
export async function readSpecialCmsImageAction(special: SpecialCmsImage): Promise<ActionReturn<ExpandedCmsImage>> {
    if (!Object.values(SpecialCmsImage).includes(special)) {
        return createActionError('BAD PARAMETERS', `${special} is not special`)
    }
    const specialRes = await safeServerCall(() => readSpecialCmsImage(special))
    if (!specialRes.success) {
        if (specialRes.errorCode === 'NOT FOUND') {
            return await safeServerCall(() => createCmsImage({
                name: special,
                special,
            }))
        }
        return specialRes
    }
    const cmsImage = specialRes.data
    //TODO: Auth on visibilty
    return { success: true, data: cmsImage }
}
