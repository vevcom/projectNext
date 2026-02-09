import { RequirePermission } from '@/auth/authorizer/RequirePermission'

export const ombulAuth = {
    read: RequirePermission.staticFields({ permission: 'OMBUL_READ' }),
    readAll: RequirePermission.staticFields({ permission: 'OMBUL_READ' }),
    readLatest: RequirePermission.staticFields({ permission: 'OMBUL_READ' }),
    updateCmsCoverImage: RequirePermission.staticFields({ permission: 'OMBUL_ADMIN' }),
    destroy: RequirePermission.staticFields({ permission: 'OMBUL_ADMIN' }),
    create: RequirePermission.staticFields({ permission: 'OMBUL_ADMIN' }),
    update: RequirePermission.staticFields({ permission: 'OMBUL_ADMIN' }),
    updateFile: RequirePermission.staticFields({ permission: 'OMBUL_ADMIN' })
} as const
