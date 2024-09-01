import { AutherFactory } from './AutherFactory'
import { checkVisibility } from '@/auth/checkVisibility'
import type { VisibilityCollapsed } from '@/services/visibility/Types'
import type { Permission } from '@prisma/client'

export const RequireVisibility = AutherFactory<
    'USER_NOT_REQUIERED_FOR_AUTHORIZED',
    { bypassPermission: Permission },
    { visibility: VisibilityCollapsed }
> ((session, { visibility }, { bypassPermission }) => ({
    success: session.permissions.includes(bypassPermission) || checkVisibility(session, visibility, 'REGULAR'),
    session
})
)
