import { AutherFactory } from './Auther'
import type { Permission } from '@prisma/client'

export const RequirePermission = AutherFactory<
    { permission: Permission },
    Record<string, never>,
    'USER_NOT_REQUIERED_FOR_AUTHORIZED'
>(({ session, staticFields }) => ({
    success: session.permissions.includes(staticFields.permission),
    session,
    errorMessage: `Du trenger tillatelse '${staticFields.permission}' for å få tilgang`
}))
