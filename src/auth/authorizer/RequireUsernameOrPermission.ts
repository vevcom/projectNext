import { AuthorizerFactory } from './Authorizer'
import type { Permission } from '@prisma/client'

export const RequireUsernameOrPermission = AuthorizerFactory<
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
        success: session.user !== null && session.user.username === dynamicFields.username,
        session,
        errorMessage: 'Du har ikke tilgang til denne ressursen'
    }
})
