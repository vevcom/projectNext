'use server'
import { createImage, createManyImages } from '@/services/images/create'
import { action } from '@/actions/action'

export const createImageAction = action(createImage)

export const createImagesAction = action(createManyImages)
