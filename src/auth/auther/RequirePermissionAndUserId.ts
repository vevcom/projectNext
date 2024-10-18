import { AutherFactory } from './Auther'
import type { Permission } from '@prisma/client'

export const RequirePermissionAndUserId = AutherFactory<
    { permission: Permission },
    { userId: number },
    'USER_REQUIERED_FOR_AUTHORIZED'
>(({ session, staticFields, dynamicFields }) => {
    if (!session.user) {
        return {
            success: false,
            session
        }
    }
    if (session.user.id !== dynamicFields.userId) {
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
