import type { SpecialCollection, SpecialVisibilityPurpose } from '@prisma/client'

/**
 * Each special image collection links to a special visibility known at compile time
 */
export const specialCollectionsSpecialVisibilityMap = {
    OMBULCOVERS: {
        specialVisibility: 'OMBUL'
    },
    PROFILEIMAGES: {
        specialVisibility: 'USER'
    },
    STANDARDIMAGES: {
        specialVisibility: 'PUBLIC'
    },
    COMMITTEELOGOS: {
        specialVisibility: 'COMMITTEE'
    }
} satisfies {[T in SpecialCollection]: {
    specialVisibility: SpecialVisibilityPurpose
}}
