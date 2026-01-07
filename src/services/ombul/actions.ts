'use server'
import { ombulOperations } from './operations'
import { makeAction } from '@/services/serverAction'

export const createOmbulAction = makeAction(ombulOperations.create)
export const destroyOmbulAction = makeAction(ombulOperations.destroy)
export const readOmbulAction = makeAction(ombulOperations.read)
export const readLatestOmbulAction = makeAction(ombulOperations.readLatest)
export const readOmbulsAction = makeAction(ombulOperations.readAll)
export const updateOmbulCmsCoverImageAction = makeAction(ombulOperations.updateCmsCoverImage)
export const updateOmbulAction = makeAction(ombulOperations.update)
export const updateOmbulFileAction = makeAction(ombulOperations.updateFile)
