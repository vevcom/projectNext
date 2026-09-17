'use server'

import { specialImagePanelOperations } from './operations'
import { makeAction } from '@/services/serverAction'

export const readFlairImagesCollectionAction =
    makeAction(specialImagePanelOperations.flairImages.readCollection)
export const readImagesPageInFlairImagesCollectionAction =
    makeAction(specialImagePanelOperations.flairImages.readPageOfImagesInCollection)

export const readOmbulCoversCollectionAction =
    makeAction(specialImagePanelOperations.ombulCovers.readCollection)
export const readImagesPageInOmbulCoversCollectionAction =
    makeAction(specialImagePanelOperations.ombulCovers.readPageOfImagesInCollection)

export const readCommitteeLogosCollectionAction =
    makeAction(specialImagePanelOperations.committeeLogos.readCollection)
export const readImagesPageInCommitteeLogosCollectionAction =
    makeAction(specialImagePanelOperations.committeeLogos.readPageOfImagesInCollection)

export const readProfileImagesCollectionAction =
    makeAction(specialImagePanelOperations.profileImages.readCollection)
export const readImagesPageInProfileImagesCollectionAction =
    makeAction(specialImagePanelOperations.profileImages.readPageOfImagesInCollection)

export const readStandardImagesCollectionAction =
    makeAction(specialImagePanelOperations.standardImages.readCollection)
export const readImagesPageInStandardImagesCollectionAction =
    makeAction(specialImagePanelOperations.standardImages.readPageOfImagesInCollection)
