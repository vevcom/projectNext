'use server'

import { action } from '@/services/action'
import { imageOperations } from '@/services/images/operations'

export const createImageAction = action(imageOperations.create)
export const createImagesAction = action(imageOperations.createMany)

export const destroyImageAction = action(imageOperations.destroy)

/**
 * Read one image.
*/
export const readImageAction = action(imageOperations.read)
/**
 * Read one page of images.
 */
export const readImagesPageAction = action(imageOperations.readPage)
/**
 * Read one special image.
 */
export const readSpecialImageAction = action(imageOperations.readSpecial)

export const updateImageAction = action(imageOperations.update)
