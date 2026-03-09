'use server'

import { safeServerCall } from '@/services/actionError'
import { createMembershipsForGroup } from '@/services/groups/memberships/create'
import { destoryMembershipOfUser } from '@/services/groups/memberships/destroy'
import { updateMembership } from '@/services/groups/memberships/update'
import type { ExpandedMembership } from '@/services/groups/memberships/types'
import type { ActionReturn } from '@/services/actionTypes'

// TODO: All the following actions should be authed on RequirePermissionOrGroupAdmin when refactored.

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
    return await safeServerCall(() => updateMembership({
        ...membership,
        orderArg: 'ACTIVE'
    }, { admin }))
}

export async function updateMembershipActiveAction(membership: {
    groupId: number
    userId: number
}, active: boolean): Promise<ActionReturn<ExpandedMembership>> {
    return await safeServerCall(() => updateMembership({
        ...membership,
        orderArg: 'ACTIVE'
    }, { active }))
}
