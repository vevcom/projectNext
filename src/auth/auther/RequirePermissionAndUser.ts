import { AutherFactory } from './Auther'
import type { Permission } from '@prisma/client'

export const RequirePermissionAndUser = AutherFactory<
    { permission: Permission },
    Record<string, never>,
    'USER_REQUIERED_FOR_AUTHORIZED'
>(({ session, staticFields }) => {
    if (!session.user) {
        return {
            success: false,
            session
        }
    }
    return {
        success: session.permissions.includes(staticFields.permission),
        session
    }
})
