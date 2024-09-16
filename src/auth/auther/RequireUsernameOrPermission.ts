import { AutherFactory } from './Auther'
import type { Permission } from '@prisma/client'

export const RequireUsernameOrPermission = AutherFactory<
    { permission: Permission },
    { username: string },
    'USER_NOT_REQUIERED_FOR_AUTHORIZED'
>(({ session, staticFields, dynamicFields }) => {
    if (session.permissions.includes(staticFields.permission)) {
        return {
            success: true,
            session
        }
    }
    return {
        success: session.user?.username === dynamicFields.username,
        session
    }
})
