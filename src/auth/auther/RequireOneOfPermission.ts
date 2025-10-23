import { AutherFactory } from './Auther'
import type { Permission } from '@prisma/client'

export const RequireOneOfPermission = AutherFactory<
    { permissions: Permission[] },
    Record<string, never>,
    'USER_NOT_REQUIERED_FOR_AUTHORIZED'
>(({ session, staticFields }) => ({
    success: staticFields.permissions.some(permission => session.permissions.includes(permission)),
    errorMessage: 'Du har ikke en av de nødvendige tillatelsene',
    session,
}))
