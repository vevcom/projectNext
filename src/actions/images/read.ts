'use server'
import { ImageMethods } from '@/services/images/methods'
import { action } from '@/actions/action'

/**
 * Read one image.
*/
export const readImageAction = action(ImageMethods.read)
/**
 * Read one page of images.
 */
export const readImagesPageAction = action(ImageMethods.readPage)
/**
 * Read one special image.
 */
export const readSpecialImageAction = action(ImageMethods.readSpecial)
