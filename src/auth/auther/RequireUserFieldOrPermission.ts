import { AutherFactory } from './Auther'
import type { Permission } from '@prisma/client'

/**
 * Authenticates session if session has permission or session.user with specific field.
 */
export const RequireUserFieldOrPermission = AutherFactory<
    { permission: Permission },
    {
        username?: string,
        id?: number,
        email?: string,
    },
    'USER_NOT_REQUIERED_FOR_AUTHORIZED'
>(({ session, staticFields, dynamicFields }) => {
    if (session.permissions.includes(staticFields.permission)) {
        return {
            success: true,
            session
        }
    }
    if (dynamicFields.id && session.user !== null && session.user.id === dynamicFields.id) {
        return {
            success: true,
            session
        }
    }
    if (dynamicFields.username && session.user !== null && session.user.username === dynamicFields.username) {
        return {
            success: true,
            session
        }
    }
    if (dynamicFields.email && session.user !== null && session.user.email === dynamicFields.email) {
        return {
            success: true,
            session
        }
    }
    return {
        success: false,
        session,
        errorMessage: `
            Du har ikke tilgang til denne ressursen
        `
    }
})
