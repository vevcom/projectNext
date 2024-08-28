'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { destroyRole } from '@/services/permissionRoles/destroy'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedRole } from '@/services/permissionRoles/Types'

export async function destroyRoleAction(roleId: number): Promise<ActionReturn<ExpandedRole>> {
    //TODO: Auth
    return await safeServerCall(() => destroyRole(roleId))
}
