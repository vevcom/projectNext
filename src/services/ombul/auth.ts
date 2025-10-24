import { RequirePermission } from '@/auth/auther/RequirePermission'

export const ombulAuth = {
    read: RequirePermission.staticFields({ permission: 'OMBUL_READ' }),
    readAll: RequirePermission.staticFields({ permission: 'OMBUL_READ' }),
    readLatest: RequirePermission.staticFields({ permission: 'OMBUL_READ' }),
    updateCmsCoverImage: RequirePermission.staticFields({ permission: 'OMBUL_UPDATE' })
} as const
