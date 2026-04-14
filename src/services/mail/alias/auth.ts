import { RequirePermission } from '@/auth/authorizer/RequirePermission'

export const mailAliasAuth = {
    create: RequirePermission.staticFields({ permission: 'MAILALIAS_ADMIN' }),
    readMany: RequirePermission.staticFields({ permission: 'MAILALIAS_READ' }),
    read: RequirePermission.staticFields({ permission: 'MAILALIAS_READ' }),
    update: RequirePermission.staticFields({ permission: 'MAILALIAS_ADMIN' }),
    destroy: RequirePermission.staticFields({ permission: 'MAILALIAS_ADMIN' }),
} as const
