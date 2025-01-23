import { AutherFactory } from './Auther'
import type { Permission } from '@prisma/client'

export const RequirePermissionAndDynamicPermission = AutherFactory<
    {
        permission: Permission,
        dynamicPermission: Permission,
    },
    {
        permissions: Permission[],
    },
    'USER_NOT_REQUIERED_FOR_AUTHORIZED'
>(({ session, staticFields, dynamicFields }) => {
    if (!dynamicFields.permissions.includes(staticFields.dynamicPermission)) {
        return {
            success: false,
            session
        }
    }

    return {
        success: session.permissions.includes(staticFields.permission),
        session
    }
})
