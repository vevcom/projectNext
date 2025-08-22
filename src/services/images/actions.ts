'use server'

import { action } from '@/actions/action'
import { ImageMethods } from '@/services/images/methods'

export const createImageAction = action(ImageMethods.create)
export const createImagesAction = action(ImageMethods.createMany)

export const destroyImageAction = action(ImageMethods.destroy)

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

export const updateImageAction = action(ImageMethods.update)
