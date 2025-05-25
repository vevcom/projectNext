'use server'
import { ImageMethods } from '@/services/images/methods'
import { action } from '@/actions/action'

export const createImageAction = action(ImageMethods.create)
export const createImagesAction = action(ImageMethods.createMany)
