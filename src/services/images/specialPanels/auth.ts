import { flairImagesImagePanelAuth } from '@/services/flairs/auth'
import { ombulCoversImagePanelAuth } from '@/services/ombul/auth'
import { committeeLogosImagePanelAuth } from '@/services/groups/committees/auth'
import { profileImagesImagePanelAuth } from '@/services/users/auth'
import { standardImagesImagePanelAuth } from '@/services/images/standard/auth'
import { promoImagesImagePanelAuth } from '@/services/promo/auth'

export const specialImagePanelAuth = {
    flairImages: flairImagesImagePanelAuth,
    ombulCovers: ombulCoversImagePanelAuth,
    committeeLogos: committeeLogosImagePanelAuth,
    profileImages: profileImagesImagePanelAuth,
    standardImages: standardImagesImagePanelAuth,
    promoImages: promoImagesImagePanelAuth,
} as const
