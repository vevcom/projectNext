import { specialImagePanelAuth } from './auth'
import {
    readFlairImagesCollectionAction,
    readImagesPageInFlairImagesCollectionAction,
    readOmbulCoversCollectionAction,
    readImagesPageInOmbulCoversCollectionAction,
    readCommitteeLogosCollectionAction,
    readImagesPageInCommitteeLogosCollectionAction,
    readProfileImagesCollectionAction,
    readImagesPageInProfileImagesCollectionAction,
    readStandardImagesCollectionAction,
    readImagesPageInStandardImagesCollectionAction,
} from './actions'
import type { ActionFromServiceOperation } from '@/services/actionTypes'
import type { implementSpecialCollection } from '@/services/images/subservice/special/implement'
import type { SpecialCollection } from '@/prisma-generated-pn-types'

type SpecialCollectionPanelOperations = ReturnType<typeof implementSpecialCollection>['specialCollectionPanelOperations']

/**
 * Everything a frontend panel needs for a special collection, keyed by the `SpecialCollection` it
 * shows: the auth deciding whether the session may see the panel, and the actions for reading the
 * collection itself and paging through the images inside it.
 */
export const specialImagePanels = {
    FLAIRIMAGES: {
        auth: specialImagePanelAuth.flairImages,
        readCollectionAction: readFlairImagesCollectionAction,
        readPageOfImagesInCollectionAction: readImagesPageInFlairImagesCollectionAction,
    },
    OMBULCOVERS: {
        auth: specialImagePanelAuth.ombulCovers,
        readCollectionAction: readOmbulCoversCollectionAction,
        readPageOfImagesInCollectionAction: readImagesPageInOmbulCoversCollectionAction,
    },
    COMMITTEELOGOS: {
        auth: specialImagePanelAuth.committeeLogos,
        readCollectionAction: readCommitteeLogosCollectionAction,
        readPageOfImagesInCollectionAction: readImagesPageInCommitteeLogosCollectionAction,
    },
    PROFILEIMAGES: {
        auth: specialImagePanelAuth.profileImages,
        readCollectionAction: readProfileImagesCollectionAction,
        readPageOfImagesInCollectionAction: readImagesPageInProfileImagesCollectionAction,
    },
    STANDARDIMAGES: {
        auth: specialImagePanelAuth.standardImages,
        readCollectionAction: readStandardImagesCollectionAction,
        readPageOfImagesInCollectionAction: readImagesPageInStandardImagesCollectionAction,
    },
} as const satisfies Record<SpecialCollection, {
    auth: typeof specialImagePanelAuth[keyof typeof specialImagePanelAuth],
    readCollectionAction: ActionFromServiceOperation<SpecialCollectionPanelOperations['readCollection']>,
    readPageOfImagesInCollectionAction:
        ActionFromServiceOperation<SpecialCollectionPanelOperations['readPageOfImagesInCollection']>,
}>
