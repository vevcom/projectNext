import { RequirePermission } from '@/auth/authorizer/RequirePermission'
import { RequirePermissionAndUserId } from '@/auth/authorizer/RequirePermissionAndUserId'


export const omegaQuotesAuth = {
    create: RequirePermissionAndUserId.staticFields({ permission: 'OMEGAQUOTES_WRITE' }),
    readPage: RequirePermission.staticFields({ permission: 'OMEGAQUOTES_READ' })
} as const
