'use server'

import { makeAction } from '@/services/serverAction'
import { dynamicImageOperations } from '@/services/images/dynamic/operations'

export const readImageCollectionDoubleLevelVisibilityAction =
    makeAction(dynamicImageOperations.visibility.readDoubleLevelMatrix)
export const updateImageCollectionRegularLevelVisibilityAction =
    makeAction(dynamicImageOperations.visibility.updateRegularLevel)
export const updateImageCollectionAdminLevelVisibilityAction =
    makeAction(dynamicImageOperations.visibility.updateAdminLevel)

export const readImageCollectionAction = makeAction(dynamicImageOperations.readCollection)
export const readImageCollectionsPageAction = makeAction(dynamicImageOperations.readCollectionPage)
export const createImageCollectionAction = makeAction(dynamicImageOperations.createCollection)
export const destroyImageCollectionAction = makeAction(dynamicImageOperations.destroyCollection)
export const updateImageCollectionAction = makeAction(dynamicImageOperations.updateCollection)

export const uploadImageAction = makeAction(dynamicImageOperations.uploadImage)
export const uploadManyImagesAction = makeAction(dynamicImageOperations.uploadManyImages)
export const readImagesPageInCollectionAction = makeAction(dynamicImageOperations.readPageOfImagesInCollection)
export const updateImageMetaAction = makeAction(dynamicImageOperations.updateImageMeta)
export const destroyImageAction = makeAction(dynamicImageOperations.destroyImage)
