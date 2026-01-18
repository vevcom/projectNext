import { AuthorizerFactory } from './Authorizer'
import type { Permission } from '@/prisma-generated-pn-types'

export const RequirePermission = AuthorizerFactory<
    { permission: Permission },
    Record<string, never>,
    'USER_NOT_REQUIERED_FOR_AUTHORIZED'
>(({ session, staticFields }) => ({
    success: session.permissions.includes(staticFields.permission),
    session,
    errorMessage: `Du trenger tillatelse '${staticFields.permission}' for å få tilgang`
}))
