import type { Permission, SpecialCollection } from "@prisma/client"

type SpecialCollectionsVisibilityConfig = {
    [T in SpecialCollection]: {
        regularLevel: Permission | null, // Null signifies no authorization needed
        adminLevel: Permission | null // Null signifies no authorization needed
    }
}

/**
 * An object that defines the visibility of special collections. The visibility of special collections
 * is linked to permissions, not a grop matrix. (Visibility type special).
 * This object delares the speial visibility of special collections. So if one special collection 
 * were to misteriously disappear, it will be created again with visibility based on this object.
 */
export const specialCollectionsVisibilityConfig : SpecialCollectionsVisibilityConfig = {
    OMBULCOVERS: {
        regularLevel: 'OMBUL_READ',
        adminLevel: 'OMBUL_CREATE'
    },
    STANDARDIMAGES: {
        regularLevel: null,
        adminLevel: 'CMS_ADMIN'
    },
    COMMITTEELOGOS: {
        regularLevel: 'COMMITTEE_READ',
        adminLevel: 'COMMITTEE_CREATE'
    },
    PROFILEIMAGES: {
        regularLevel: 'USER_READ',
        adminLevel: 'USER_CREATE'
    }
}