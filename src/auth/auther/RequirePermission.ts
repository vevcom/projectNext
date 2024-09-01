import { AutherFactory } from './AutherFactory'
import type { Permission } from '@prisma/client'

export const RequirePermission = AutherFactory<
    'USER_NOT_REQUIERED_FOR_AUTHORIZED',
    undefined,
    { permission: Permission }
>((session, { permission }) => ({
    success: session.permissions.includes(permission),
    session
}))
