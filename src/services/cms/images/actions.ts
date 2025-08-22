'use server'

import { createActionError, createZodActionError, safeServerCall } from '@/services/actionError'
import { createCmsImage } from '@/services/cms/images/create'
import { readCmsImage, readSpecialCmsImage } from '@/services/cms/images/read'
import { updateCmsImage, updateCmsImageConfig } from '@/services/cms/images/update'
import { createCmsImageActionValidation } from '@/services/cms/images/validation'
import { SpecialCmsImage } from '@prisma/client'
import type { CreateCmsImageActionTypes } from '@/services/cms/images/validation'
import type { ExpandedCmsImage } from '@/services/cms/images/Types'
import type { ActionReturn } from '@/services/actionTypes'
import type { CmsImage, Image, ImageSize } from '@prisma/client'

export async function createCmsImageAction(
    rawData: FormData | CreateCmsImageActionTypes['Type'],
    image?: Image,
): Promise<ActionReturn<ExpandedCmsImage>> {
    //TODO: Auth route (very few people should be able to create stand alone cmsImages...)
    const parse = createCmsImageActionValidation.typeValidate(rawData)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createCmsImage(data, image))
}

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

export async function updateCmsImageAction(cmsImageId: number, imageId: number): Promise<ActionReturn<CmsImage>> {
    //TODO: Auth on visibility (or permission if special)
    return await safeServerCall(() => updateCmsImage(cmsImageId, imageId))
}

export async function updateCmsImageConfigAction(
    cmsImageId: number,
    config: {imageSize: ImageSize}
): Promise<ActionReturn<CmsImage>> {
    //TODO: Auth on visibility (or permission if special)
    return await safeServerCall(() => updateCmsImageConfig(cmsImageId, config))
}
