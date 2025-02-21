'use server'
import { ImageMethods } from '@/services/images/methods'
import { action } from '@/actions/action'

export const updateImageAction = action(ImageMethods.update)
