'use server'

import { createActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { getUser } from '@/auth/getUser'
import { createMembershipsForGroup } from '@/server/groups/memberships/create'
import type { ActionReturn } from '@/actions/Types'

/**
 * WARNING: This action will lead to error if used with group types not in CanEasalyManageMembership
 */
export async function createMembershipsForGroupAction({
    groupId,
    users
}: {
    groupId: number,
    users: {
        userId: number,
        admin: boolean
    }[]
}): Promise<ActionReturn<void>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['GROUP_ADMIN']]
    })
    if (!authorized) return createActionError(status)

    return safeServerCall(() => createMembershipsForGroup(groupId, users))
}
