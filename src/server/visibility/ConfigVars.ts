import type { Permission, VisibilityPurpose } from '@prisma/client'

/**
 * These are the permissions that buypass the visibiity system. i.e. for reading images
 * if the user has the permission it does not matter if the visibility is fullfilled.
 */
export const BypassPermissions = {
    IMAGE: 'IMAGE_ADMIN',
    CMS: 'CMS_ADMIN',
    EVENT: 'EVENT_ADMIN'
} as const satisfies { [key in VisibilityPurpose]: Permission }

export type BypassPermissions = typeof BypassPermissions[keyof typeof BypassPermissions]

export const PurposeTextsConfig = {
    IMAGE: 'Bilder',
    CMS: 'CMS',
    EVENT: 'Arrangementer (Hvad der hender)'
} as const satisfies { [key in VisibilityPurpose]: string }