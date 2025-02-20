'use server'

import { readImage, readImagePage, readSpecialImage } from '@/services/images/read'
import { action } from '@/actions/action'

/**
 * Read one page of images.
 */
export const readImagesPageAction = action(readImagePage)

/**
 * Read one image.
*/
export const readImageAction = action(readImage)

/**
 * Read one special image.
 */
export const readSpecialImageAction = action(readSpecialImage)
