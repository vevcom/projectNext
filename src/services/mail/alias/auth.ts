import { RequirePermission } from '@/auth/auther/RequirePermission'

//TODO: Use authers when refactoring to operations.ts
export const mailAliasAuth = {
    create: RequirePermission.staticFields({ permission: 'MAILALIAS_CREATE' }),
    destroy: RequirePermission.staticFields({ permission: 'MAILALIAS_DESTROY' }),
    read: RequirePermission.staticFields({ permission: 'MAILALIAS_READ' }),
    update: RequirePermission.staticFields({ permission: 'MAILALIAS_UPDATE' }),
} as const
