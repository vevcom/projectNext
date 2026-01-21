import { RequireNothing } from '@/auth/authorizer/RequireNothing'
import { RequirePermission } from '@/auth/authorizer/RequirePermission'
import { RequireUserIdOrPermission } from '@/auth/authorizer/RequireUserIdOrPermission'

export const flairAuth = {
    create: RequirePermission.staticFields({ permission: 'FLAIR_ADMIN' }),
    destroy: RequirePermission.staticFields({ permission: 'FLAIR_ADMIN' }),
    update: RequirePermission.staticFields({ permission: 'FLAIR_ADMIN' }),
    assignToUser: RequirePermission.staticFields({ permission: 'FLAIR_ADMIN' }),
    unAssignToUser: RequirePermission.staticFields({ permission: 'FLAIR_ADMIN' }),
    increaseRank: RequirePermission.staticFields({ permission: 'FLAIR_ADMIN' }),
    decreaseRank: RequirePermission.staticFields({ permission: 'FLAIR_ADMIN' }),
    read: RequireNothing.staticFields({}),
    readAll: RequireNothing.staticFields({}),
    readUserFlairs: RequireUserIdOrPermission.staticFields({ permission: 'USERS_READ' }),
    updateCmsImage: RequirePermission.staticFields({ permission: 'FLAIR_ADMIN' }),
} as const
