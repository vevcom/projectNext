'use server'
import { createActionError, createPrismaActionError } from '@/actions/error'
import { SpecialCmsImage } from '@prisma/client'
import type { ExpandedCmsImage } from '@/cms/images/Types'
import type { ActionReturn } from '@/actions/Types'
import { readCmsImage, readSpecialCmsImage } from '@/server/cms/images/read'
import { createCmsImage } from '@/server/cms/images/create'

/**
 * A action to read a cms image including the image associated with it
 * @param name - name of the cms image the image
 * @returns
 */
export async function readCmsImageAction(name: string): Promise<ActionReturn<ExpandedCmsImage>> {
    //TODO: auth on visibilty
    return await readCmsImage(name)
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
    const specialRes = await readSpecialCmsImage(special)
    if (!specialRes.success) {
        if (specialRes.errorCode === 'NOT FOUND') {
            return await createCmsImage(special, {
                special,
            })
        }
        return specialRes
    }
    const cmsImage = specialRes.data
    //TODO: Auth on visibilty
    return { success: true, data: cmsImage }
}
