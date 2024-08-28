'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createActionError } from '@/actions/error'
import { readImage, readImagesPage, readSpecialImage } from '@/services/images/read'
import { createBadImage } from '@/services/images/create'
import { SpecialImage } from '@prisma/client'
import type { Image } from '@prisma/client'
import type { ReadPageInput } from '@/services/paging/Types'
import type { ActionReturn } from '@/actions/Types'
import type { ImageDetails, ImageCursor } from '@/services/images/Types'

/**
 * Read one page of images.
 * @param pageReadInput - the page with details and page.
 * @returns
 */
export async function readImagesPageAction<const PageSize extends number>(
    pageReadInput: ReadPageInput<PageSize, ImageCursor, ImageDetails>
): Promise<ActionReturn<Image[]>> {
    //TODO: auth route based on collection
    return await safeServerCall(() => readImagesPage(pageReadInput))
}

/**
 * Read one image.
 * @param nameOrId - the name or id of the image to read
 * @returns
 */
export async function readImageAction(nameOrId: string | number): Promise<ActionReturn<Image>> {
    //TODO: auth route based on collection
    return await safeServerCall(() => readImage(nameOrId))
}

/**
 * Action that reads a "special" image - read on this in the docs. If it does not exist it will create it, but
 * its conntent will not be the intended content. This is NOT under any circomstainses supposed to happen
 * @param special - the special image to read
 * @returns the special image
 */
export async function readSpecialImageAction(special: SpecialImage): Promise<ActionReturn<Image>> {
    if (!Object.values(SpecialImage).includes(special)) {
        return createActionError('BAD PARAMETERS', `${special} is not special`)
    }
    //TODO: auth image based on collection
    const imageRes = await safeServerCall(() => readSpecialImage(special))
    if (!imageRes.success) {
        if (imageRes.errorCode === 'NOT FOUND') {
            return await safeServerCall(() => createBadImage(special, {
                special,
            }))
        }
        return imageRes
    }
    const image = imageRes.data
    return { success: true, data: image }
}
