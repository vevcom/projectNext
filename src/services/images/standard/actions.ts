'use server'

import { makeAction } from '@/services/serverAction'
import { standardImageCollectionOperations } from '@/services/images/standard/operations'

export const readStandardImageAction = makeAction(standardImageCollectionOperations.readStandardImage)
export const readAllStandardImagesAction = makeAction(standardImageCollectionOperations.readAllStandardImages)
