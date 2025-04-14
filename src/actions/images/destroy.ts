'use server'
import { action } from '@/actions/action'
import { ImageMethods } from '@/services/images/methods'

export const destroyImageAction = action(ImageMethods.destroy)
