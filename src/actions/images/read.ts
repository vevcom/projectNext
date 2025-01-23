'use server'
import { ActionNoData } from '@/actions/Action'
import { Images } from '@/services/images'


/**
 * Read one page of images.
 */
export const readImagesPageAction = ActionNoData(Images.readPage)

/**
 * Read one image.
*/
export const readImageAction = ActionNoData(Images.read)

/**
 * Read one special image.
 */
export const readSpecialImageAction = ActionNoData(Images.readSpecial)
