import { flairImagesImagePanelAuth } from '@/services/flairs/auth'
import { ombulCoversImagePanelAuth } from '@/services/ombul/auth'
import { committeeLogosImagePanelAuth } from '@/services/groups/committees/auth'
import { profileImagesImagePanelAuth } from '@/services/users/auth'
import { standardImagesImagePanelAuth } from '@/services/images/standard/auth'
import type { SpecialCollection } from '@/prisma-generated-pn-types'

export const specialImagePanelAuth = {
    flairImages: flairImagesImagePanelAuth,
    ombulCovers: ombulCoversImagePanelAuth,
    committeeLogos: committeeLogosImagePanelAuth,
    profileImages: profileImagesImagePanelAuth,
    standardImages: standardImagesImagePanelAuth,
} as const

/**
 * The same panel authorizers keyed by the SpecialCollection they guard. Special collections have no
 * meaningful visibility levels, so passing the panel auth is what it means to administrate one -
 * this map is how a service holding only a collection's `special` field can make that check.
 */
export const specialImageCollectionsAdminAuth = {
    FLAIRIMAGES: specialImagePanelAuth.flairImages,
    OMBULCOVERS: specialImagePanelAuth.ombulCovers,
    COMMITTEELOGOS: specialImagePanelAuth.committeeLogos,
    PROFILEIMAGES: specialImagePanelAuth.profileImages,
    STANDARDIMAGES: specialImagePanelAuth.standardImages,
} as const satisfies Record<SpecialCollection, unknown>
