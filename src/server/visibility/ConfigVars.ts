import type { Permission, VisibilityPurpose, SpecialVisibilityPurpose } from '@prisma/client'

/**
 * These are the permissions that buypass the visibiity system. i.e. for reading images
 * if the user has the permission it does not matter if the visibility is fullfilled.
 */
export const BypassPermissions = {
    IMAGE: 'IMAGE_ADMIN',
    NEWS_ARTICLE: 'CMS_ADMIN',
    ARTICLE_CATEGORY: 'CMS_ADMIN',
    EVENT: 'EVENT_ADMIN',
    SPECIAL: null // null means there is no bypass permission
} as const satisfies { [key in VisibilityPurpose]: Permission | null }

export type BypassPermissions = typeof BypassPermissions[keyof typeof BypassPermissions]

export const PurposeTextsConfig = {
    IMAGE: 'Bilder',
    NEWS_ARTICLE: 'Nyheter',
    ARTICLE_CATEGORY: 'Artikkelkategorier',
    EVENT: 'Arrangementer (Hvad der hender)',
    SPECIAL: 'Speesielle ting'
} as const satisfies { [key in VisibilityPurpose]: string }

/**
 * Which permissions link to special visibility purposes
 * If the spacial visibility were to disappear, it will be regenerated from this.
 */
export const SpecialVisibilityConfig = {
    OMBUL: {
        regularLevel: 'OMBUL_READ',
        adminLevel: 'OMBUL_CREATE'
    },
    PUBLIC: {
        regularLevel: null,
        adminLevel: 'CMS_ADMIN'
    },
    COMMITTEE: {
        regularLevel: 'COMMITTEE_READ',
        adminLevel: 'COMMITTEE_CREATE'
    },
    USER: {
        regularLevel: 'USER_READ',
        adminLevel: 'USER_CREATE'
    }
} satisfies {[T in SpecialVisibilityPurpose] : {
    regularLevel: Permission | null,
    adminLevel: Permission | null
}}