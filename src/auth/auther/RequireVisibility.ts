import { AutherFactory } from './Auther'
import { checkVisibility } from '@/auth/checkVisibility'
import type { VisibilityCollapsed } from '@/services/visibility/Types'
import type { Permission } from '@prisma/client'

export const RequireVisibility = AutherFactory<
    { bypassPermission: Permission },
    { visibility: VisibilityCollapsed },
    'USER_NOT_REQUIERED_FOR_AUTHORIZED'
> (({ session, dynamicFields, staticFields }) => ({
    success: checkVisibility(session, dynamicFields.visibility, 'REGULAR') ||
        session.permissions.includes(staticFields.bypassPermission),
    session,
}))
