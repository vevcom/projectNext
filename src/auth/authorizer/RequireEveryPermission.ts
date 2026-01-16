import { AuthorizerFactory } from './Authorizer'
import type { Permission } from '@prisma/client'

export const RequireEveryPermission = AuthorizerFactory<
    { permissions: Permission[] },
    Record<string, never>,
    'USER_NOT_REQUIERED_FOR_AUTHORIZED'
>(({ session, staticFields }) => ({
    success: staticFields.permissions.every(permission => session.permissions.includes(permission)),
    errorMessage: 'Du har ikke en av de nødvendige tillatelsene',
    session,
}))
