'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { destroyRole } from '@/server/permissionRoles/destroy'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedRole } from '@/server/permissionRoles/Types'

export async function destroyRoleAction(roleId: number): Promise<ActionReturn<ExpandedRole>> {
    //TODO: Auth
    return await safeServerCall(() => destroyRole(roleId))
}
