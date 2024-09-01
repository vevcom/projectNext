import { AutherFactory } from './AutherFactory'
import type { Permission } from '@prisma/client'

export const RequirePermissioAndUser = AutherFactory<
    'USER_REQUIERED_FOR_AUTHORIZED',
    undefined,
    { permission: Permission }
>((session, { permission }) => {
    if (!session.user) {
        return {
            success: false,
            session
        }
    }
    return {
        success: session.permissions.includes(permission),
        session
    }
})
