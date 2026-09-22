import { RequireNothing } from '@/auth/authorizer/RequireNothing'
import { RequirePermission } from '@/auth/authorizer/RequirePermission'

export const promoImagesImagePanelAuth = RequirePermission.staticFields({ permission: 'FRONTPAGE_ADMIN' })

export const promoAuth = {
    create: RequirePermission.staticFields({ permission: 'FRONTPAGE_ADMIN' }),
    update: RequirePermission.staticFields({ permission: 'FRONTPAGE_ADMIN' }),
    destroy: RequirePermission.staticFields({ permission: 'FRONTPAGE_ADMIN' }),
    read: RequirePermission.staticFields({ permission: 'FRONTPAGE_ADMIN' }),
    readAll: RequirePermission.staticFields({ permission: 'FRONTPAGE_ADMIN' }),
    readActive: RequireNothing.staticFields({}),
    updateImage: RequirePermission.staticFields({ permission: 'FRONTPAGE_ADMIN' }),
} as const
