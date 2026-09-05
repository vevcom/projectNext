import { RequireLevelFromDoubleLevelVisibility } from '@/auth/authorizer/RequireLevelFromDoubleLevelVisibility'
import { RequireLevelFromDoubleLevelVisibilityDynamic } from '@/auth/authorizer/RequireLevelFromDoubleLevelVisibilityDynamic'
import { RequirePermission } from '@/auth/authorizer/RequirePermission'
import { RequireVisibilityFilter } from '@/auth/authorizer/RequireVisibilityFilter'

export const newsAuth = {
    create: RequirePermission.staticFields({ permission: 'NEWS_CREATE' }),

    readDoubleLevelMatrix:
        RequireLevelFromDoubleLevelVisibility.staticFields({ level: 'REGULAR', bypassPermission: 'NEWS_ADMIN' }),
    updateRegularLevel:
        RequireLevelFromDoubleLevelVisibility.staticFields({ level: 'ADMIN', bypassPermission: 'NEWS_ADMIN' }),
    updateAdminLevel:
        RequireLevelFromDoubleLevelVisibility.staticFields({ level: 'ADMIN', bypassPermission: 'NEWS_ADMIN' }),

    destroy: RequireLevelFromDoubleLevelVisibility.staticFields({ level: 'ADMIN', bypassPermission: 'NEWS_ADMIN' }),
    update: RequireLevelFromDoubleLevelVisibility.staticFields({ level: 'ADMIN', bypassPermission: 'NEWS_ADMIN' }),
    updateArticle: RequireLevelFromDoubleLevelVisibility.staticFields({ level: 'ADMIN', bypassPermission: 'NEWS_ADMIN' }),
    setPublished:
        RequireLevelFromDoubleLevelVisibility.staticFields({ level: 'ADMIN', bypassPermission: 'NEWS_ADMIN' }),

    read: RequireLevelFromDoubleLevelVisibilityDynamic.staticFields({ bypassPermission: 'NEWS_ADMIN' }),
    readCurrent: RequireVisibilityFilter.staticFields({ bypassPermission: 'NEWS_ADMIN' }),
    readOldPage: RequireVisibilityFilter.staticFields({ bypassPermission: 'NEWS_ADMIN' }),
} as const
