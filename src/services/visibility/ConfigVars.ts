import type { Permission, VisibilityPurpose, SpecialVisibilityPurpose } from '@prisma/client'

/**
 * These are the permissions that buypass the visibiity system. i.e. for reading images
 * if the user has the permission it does not matter if the visibility is fullfilled.
 */
export const BypassPermissions = {
    IMAGE: 'IMAGE_ADMIN',
    NEWS_ARTICLE: 'FRONTPAGE_ADMIN', // just changed this to make ts happy - bypass and purposes will be removed
    ARTICLE_CATEGORY: 'FRONTPAGE_ADMIN', // just changed this to make ts happy - bypass and purposes will be removed
    EVENT: 'EVENT_ADMIN',
    SPECIAL: null // null means there is no bypass permission
} as const satisfies { [key in VisibilityPurpose]: Permission | null }

export type BypassPermissions = typeof BypassPermissions[keyof typeof BypassPermissions]

export const purposeTextsConfig = {
    IMAGE: 'Bilder',
    NEWS_ARTICLE: 'Nyheter',
    ARTICLE_CATEGORY: 'Artikkelkategorier',
    EVENT: 'Arrangementer (Hvad der hender)',
    SPECIAL: 'Spessielle ting'
} as const satisfies { [key in VisibilityPurpose]: string }

/**
 * Which permissions link to special visibility purposes
 * If the special visibility were to disappear, it will be regenerated from this.
 */
export const specialVisibilityConfig = {
    OMBUL: {
        regularLevel: 'OMBUL_READ',
        adminLevel: 'OMBUL_CREATE'
    },
    PUBLIC: {
        regularLevel: null,
        adminLevel: 'FRONTPAGE_ADMIN' // just changed this to make ts happy
    },
    COMMITTEE: {
        regularLevel: 'COMMITTEE_READ',
        adminLevel: 'COMMITTEE_CREATE'
    },
    USER: {
        regularLevel: 'USERS_READ',
        adminLevel: 'USERS_CREATE'
    }
} satisfies {[T in SpecialVisibilityPurpose]: {
    regularLevel: Permission | null,
    adminLevel: Permission | null
}}
