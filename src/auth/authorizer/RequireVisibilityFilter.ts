import { AuthorizerFactory } from './Authorizer'
import { visibilityFilter } from '@/auth/visibility/visibilityFilter'
import type { Permission } from '@/prisma-generated-pn-types'

export const RequireVisibilityFilter = AuthorizerFactory<
    { bypassPermission: Permission },
    Record<string, never>,
    'USER_NOT_REQUIERED_FOR_AUTHORIZED',
    ReturnType<typeof visibilityFilter> | undefined
> (({ session, staticFields }) => ({
    success: true,
    prismaWhereFilter:
        session.permissions.includes(staticFields.bypassPermission) ? undefined : visibilityFilter(session.memberships),
    session,
}))
