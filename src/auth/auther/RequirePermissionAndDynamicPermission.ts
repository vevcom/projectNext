import { AutherFactory } from './Auther'
import type { Permission } from '@prisma/client'

export const RequirePermissionAndDynamicPermission = AutherFactory<
    {
        permission: Permission,
        dynamicPermission: Permission,
        errorMessage?: string
    },
    {
        permissions: Permission[],
    },
    'USER_NOT_REQUIERED_FOR_AUTHORIZED'
>(({ session, staticFields, dynamicFields }) => {
    if (!session.permissions.includes(staticFields.permission)) {
        return {
            success: false,
            session
        }
    }

    const dynamicPermissionsPassed = dynamicFields.permissions.includes(staticFields.dynamicPermission)

    return {
        success: dynamicPermissionsPassed,
        session,
        errorMessage: dynamicPermissionsPassed ? undefined : staticFields.errorMessage
    }
})
