import { AuthorizerFactory } from './Authorizer'
import type { Permission } from '@prisma/client'

export const RequirePermissionAndUser = AuthorizerFactory<
    { permission: Permission },
    Record<string, never>,
    'USER_REQUIERED_FOR_AUTHORIZED'
>(({ session, staticFields }) => {
    if (!session.user) {
        return {
            success: false,
            session,
            errorMessage: 'Du må være innlogget for å få tilgang'
        }
    }
    return {
        success: session.permissions.includes(staticFields.permission),
        session,
        errorMessage: `Du trenger tillatelse '${staticFields.permission}' for å få tilgang`
    }
})
