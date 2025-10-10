'use server'

import { makeAction } from '@/services/serverAction'
import { imageOperations } from '@/services/images/operations'

export const createImageAction = makeAction(imageOperations.create)
export const createImagesAction = makeAction(imageOperations.createMany)

export const destroyImageAction = makeAction(imageOperations.destroy)

/**
 * Read one image.
*/
export const readImageAction = makeAction(imageOperations.read)
/**
 * Read one page of images.
 */
export const readImagesPageAction = makeAction(imageOperations.readPage)
/**
 * Read one special image.
 */
export const readSpecialImageAction = makeAction(imageOperations.readSpecial)

export const updateImageAction = makeAction(imageOperations.update)
