import { AuthorizerFactory } from './Authorizer'
import { checkVisibility } from '@/auth/visibility/checkVisibility'
import type { VisibilityMatrix } from '@/services/visibility/types'
import type { Permission } from '@/prisma-generated-pn-types'

export const RequireVisibility = AuthorizerFactory<
    { bypassPermission: Permission | null },
    { visibility: VisibilityMatrix },
    'USER_NOT_REQUIERED_FOR_AUTHORIZED'
> (({ session, dynamicFields, staticFields }) => ({
    success: checkVisibility(session.memberships, dynamicFields.visibility) ||
        (staticFields.bypassPermission ? session.permissions.includes(staticFields.bypassPermission) : false),
    session,
}))
