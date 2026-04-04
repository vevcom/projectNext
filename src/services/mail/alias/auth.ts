import { RequirePermission } from '@/auth/authorizer/RequirePermission'

export const mailAliasAuth = {
    create: RequirePermission.staticFields({ permission: 'MAILALIAS_ADMIN' }),
    read: RequirePermission.staticFields({ permission: 'MAILALIAS_READ' }),
    update: RequirePermission.staticFields({ permission: 'MAILALIAS_ADMIN' }),
    destroy: RequirePermission.staticFields({ permission: 'MAILALIAS_ADMIN' }),
} as const
