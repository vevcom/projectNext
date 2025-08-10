'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { destroyRole } from '@/services/permissions/destroy'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedRole } from '@/services/permissions/Types'

export async function destroyRoleAction(roleId: number): Promise<ActionReturn<ExpandedRole>> {
    //TODO: Auth
    return await safeServerCall(() => destroyRole(roleId))
}
