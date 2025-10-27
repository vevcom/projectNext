import { RequirePermission } from '@/auth/auther/RequirePermission'
import { RequirePermissionAndUserId } from '@/auth/auther/RequirePermissionAndUserId'


export const omegaQuotesAuth = {
    create: RequirePermissionAndUserId.staticFields({ permission: 'OMEGAQUOTES_WRITE' }),
    readPage: RequirePermission.staticFields({ permission: 'OMEGAQUOTES_READ' })
} as const
