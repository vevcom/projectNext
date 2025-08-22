'use server'

import { createActionError } from '@/services/actionError'
import { safeServerCall } from '@/services/actionError'
import { getUser } from '@/auth/getUser'
import { createMembershipsForGroup } from '@/services/groups/memberships/create'
import { destoryMembershipOfUser } from '@/services/groups/memberships/destroy'
import { updateMembership } from '@/services/groups/memberships/update'
import type { ExpandedMembership } from '@/services/groups/memberships/Types'
import type { ActionReturn } from '@/services/actionTypes'

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

/**
 * WARNING: Do not use this action, usually you want updateMemebershipInactivate
 * @param
 * @returns
 */
export async function destroyMembership({
    groupId,
    userId,
    orderArg,
}: {
    groupId: number,
    userId: number,
    orderArg: number
}): Promise<ActionReturn<ExpandedMembership>> {
    //TODO: make function to check that. user is admin of group

    return await safeServerCall(() => destoryMembershipOfUser({
        groupId,
        userId,
        orderArg
    }))
}

export async function updateMembershipAdminAcion(membership: {
    groupId: number
    userId: number
}, admin: boolean): Promise<ActionReturn<ExpandedMembership>> {
    //TODO: make function to check that user is admin of group
    return await safeServerCall(() => updateMembership({
        ...membership,
        orderArg: 'ACTIVE'
    }, { admin }))
}

export async function updateMembershipActiveAction(membership: {
    groupId: number
    userId: number
}, active: boolean): Promise<ActionReturn<ExpandedMembership>> {
    //TODO: make function to check that user is admin of group
    return await safeServerCall(() => updateMembership({
        ...membership,
        orderArg: 'ACTIVE'
    }, { active }))
}
