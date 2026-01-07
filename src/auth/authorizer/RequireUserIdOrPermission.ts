import { AuthorizerFactory } from './Authorizer'
import type { Permission } from '@prisma/client'

export const RequireUserIdOrPermission = AuthorizerFactory<
    { permission: Permission },
    { userId: number },
    'USER_NOT_REQUIERED_FOR_AUTHORIZED'
>(({ session, staticFields, dynamicFields }) => {
    if (session.permissions.includes(staticFields.permission)) {
        return {
            success: true,
            session
        }
    }
    return {
        success: session.user !== null && session.user.id === dynamicFields.userId,
        session,
        errorMessage: 'Du har ikke tilgang til denne ressursen'
    }
})
