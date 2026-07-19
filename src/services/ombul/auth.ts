import { RequirePermission } from '@/auth/authorizer/RequirePermission'

export const ombulAuth = {
    read: RequirePermission.staticFields({ permission: 'OMBUL_READ' }),
    readAll: RequirePermission.staticFields({ permission: 'OMBUL_READ' }),
    readLatest: RequirePermission.staticFields({ permission: 'OMBUL_READ' }),
    updateCoverImage: RequirePermission.staticFields({ permission: 'OMBUL_UPDATE' }),
    destroy: RequirePermission.staticFields({ permission: 'OMBUL_DESTROY' }),
    create: RequirePermission.staticFields({ permission: 'OMBUL_CREATE' }),
    update: RequirePermission.staticFields({ permission: 'OMBUL_UPDATE' }),
    updateFile: RequirePermission.staticFields({ permission: 'OMBUL_UPDATE' }),
    imagePanel: RequirePermission.staticFields({ permission: 'OMBUL_UPDATE' }),
    updateParagraphContent: RequirePermission.staticFields({ permission: 'OMBUL_UPDATE' }),
} as const
