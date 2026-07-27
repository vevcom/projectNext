import { AuthorizerFactory } from './Authorizer'
import { checkVisibility } from '@/auth/visibility/checkVisibility'
import type { DoubleLevelVisibilityMatrix, } from '@/services/visibility/types'
import type { Permission } from '@/prisma-generated-pn-types'

export const RequireLevelFromDoubleLevelVisibility = AuthorizerFactory<
    { level: 'REGULAR' | 'ADMIN', bypassPermission: Permission | null },
    { doubleLevelMatrix: DoubleLevelVisibilityMatrix },
    'USER_NOT_REQUIERED_FOR_AUTHORIZED'
> (({ session, dynamicFields, staticFields }) => ({
    success: checkVisibility(
        session.memberships,
        staticFields.level === 'REGULAR' ?
            dynamicFields.doubleLevelMatrix.regularLevel : dynamicFields.doubleLevelMatrix.adminLevel
    ) || (staticFields.bypassPermission ? session.permissions.includes(staticFields.bypassPermission) : false),
    session,
}))
