'use server'
import { Action } from '@/actions/Action'
import { Images } from '@/services/images'

export const createImageAction = Action(Images.create)

export const createImagesAction = Action(Images.createMany)
