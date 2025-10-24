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
            session,
            errorMessage: 'Du må være innlogget for å få tilgang'
        }
    }
    if (session.user.id !== dynamicFields.userId) {
        return {
            success: false,
            session,
            errorMessage: 'Du er ikke autorisert til å se denne ressursen'
        }
    }
    return {
        success: session.permissions.includes(staticFields.permission),
        session,
        errorMessage: `Du trenger tillatelse '${staticFields.permission}' for å få tilgang`
    }
})
