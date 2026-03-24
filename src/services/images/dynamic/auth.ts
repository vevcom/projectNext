import { RequireLevelFromDoubleLevelVisibility } from '@/auth/authorizer/RequireLevelFromDoubleLevelVisibility'
import { RequirePermission } from '@/auth/authorizer/RequirePermission'
import { RequireVisibilityFilter } from '@/auth/authorizer/RequireVisibilityFilter'

export const dynamicImageAuth = {
    readDoubleLevelMatrix:
        RequireLevelFromDoubleLevelVisibility.staticFields({ level: 'REGULAR', bypassPermission: 'IMAGE_ADMIN' }),
    updateRegularLevel:
        RequireLevelFromDoubleLevelVisibility.staticFields({ level: 'ADMIN', bypassPermission: 'IMAGE_ADMIN' }),
    updateAdminLevel:
        RequireLevelFromDoubleLevelVisibility.staticFields({ level: 'ADMIN', bypassPermission: 'IMAGE_ADMIN' }),

    readCollection:
        RequireLevelFromDoubleLevelVisibility.staticFields({ level: 'REGULAR', bypassPermission: 'IMAGE_ADMIN' }),
    readCollectionPage:
        RequireVisibilityFilter.staticFields({ bypassPermission: 'IMAGE_ADMIN' }),

    createCollection:
        RequirePermission.staticFields({ permission: 'IMAGE_COLLECTION_CREATE' }),
    destroyCollection:
        RequireLevelFromDoubleLevelVisibility.staticFields({ level: 'ADMIN', bypassPermission: 'IMAGE_ADMIN' }),
    updateCollection:
        RequireLevelFromDoubleLevelVisibility.staticFields({ level: 'ADMIN', bypassPermission: 'IMAGE_ADMIN' }),

    uploadImage:
        RequireLevelFromDoubleLevelVisibility.staticFields({ level: 'ADMIN', bypassPermission: 'IMAGE_ADMIN' }),
    uploadManyImages:
        RequireLevelFromDoubleLevelVisibility.staticFields({ level: 'ADMIN', bypassPermission: 'IMAGE_ADMIN' }),
    readPageOfImagesInCollection:
        RequireLevelFromDoubleLevelVisibility.staticFields({ level: 'REGULAR', bypassPermission: 'IMAGE_ADMIN' }),
    updateImageMeta:
        RequireLevelFromDoubleLevelVisibility.staticFields({ level: 'ADMIN', bypassPermission: 'IMAGE_ADMIN' }),
    destroyImage:
        RequireLevelFromDoubleLevelVisibility.staticFields({ level: 'ADMIN', bypassPermission: 'IMAGE_ADMIN' }),
} as const
