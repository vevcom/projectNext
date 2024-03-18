'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { destroyRole } from '@/server/rolePermissions/destroy'
import type { ActionReturn } from '@/actions/Types'
import type { RoleWithPermissions } from '@/server/rolePermissions/Types'

export async function destroyRoleAction(roleId: number): Promise<ActionReturn<RoleWithPermissions>> {
    //TODO: Auth
    return await safeServerCall(() => destroyRole(roleId))
}
