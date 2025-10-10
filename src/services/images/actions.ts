'use server'

import { action } from '@/services/action'
import { imageMethods } from '@/services/images/methods'

export const createImageAction = action(imageMethods.create)
export const createImagesAction = action(imageMethods.createMany)

export const destroyImageAction = action(imageMethods.destroy)

/**
 * Read one image.
*/
export const readImageAction = action(imageMethods.read)
/**
 * Read one page of images.
 */
export const readImagesPageAction = action(imageMethods.readPage)
/**
 * Read one special image.
 */
export const readSpecialImageAction = action(imageMethods.readSpecial)

export const updateImageAction = action(imageMethods.update)
