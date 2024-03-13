'use server'
import { createActionError } from '@/actions/error'
import { readImage, readImagesPage, readSpecialImage } from '@/server/images/read'
import { createBadImage } from '@/server/images/create'
import { SpecialImage } from '@prisma/client'
import type { Image } from '@prisma/client'
import type { ActionReturn, ReadPageInput } from '@/actions/Types'
import type { ImageDetails } from '@/server/images/Types'

/**
 * Read one page of images.
 * @param pageReadInput - the page with details and page.
 * @returns
 */
export async function readImagesPageAction<const PageSize extends number>(
    pageReadInput: ReadPageInput<PageSize, ImageDetails>
): Promise<ActionReturn<Image[]>> {
    //TODO: auth route based on collection
    return await readImagesPage(pageReadInput)
}

/**
 * Read one image.
 * @param nameOrId - the name or id of the image to read
 * @returns
 */
export async function readImageAction(nameOrId: string | number): Promise<ActionReturn<Image>> {
    //TODO: auth route based on collection
    return await readImage(nameOrId)
}

/**
 * Reads a "special" image - read on this in the docs. If it does not exist it will create it, but
 * its conntent will not be the intended content. This is NOT under any circomstainses supposed to happen
 * @param special - the special image to read
 * @returns the special image
 */
export async function readSpecialImageAction(special: SpecialImage): Promise<ActionReturn<Image>> {
    if (!Object.values(SpecialImage).includes(special)) {
        return createActionError('BAD PARAMETERS', `${special} is not special`)
    }
    //TODO: auth image based on collection
    const imageRes = await readSpecialImage(special)
    if (!imageRes.success) {
        if (imageRes.errorCode === 'NOT FOUND') {
            return await createBadImage(special, {
                special,
            })
        }
        return imageRes
    }
    const image = imageRes.data
    return { success: true, data: image }
}
