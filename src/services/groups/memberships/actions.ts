'use server'

import { safeServerCall } from '@/services/actionError'
import { createMembershipsForGroup } from '@/services/groups/memberships/create'
import { destoryMembershipOfUser } from '@/services/groups/memberships/destroy'
import { updateMembership } from '@/services/groups/memberships/update'
import { RequirePermissionOrGroupAdmin } from '@/auth/authorizer/RequirePermissionOrGroupAdmin'
import { ServerSession } from '@/auth/session/ServerSession'
import { Smorekopp } from '@/services/error'
import type { ExpandedMembership } from '@/services/groups/memberships/types'
import type { ActionReturn } from '@/services/actionTypes'

const membershipAuthorizer = RequirePermissionOrGroupAdmin.staticFields({ permission: 'GROUP_ADMIN' })

async function assertCanManageMembership(groupId: number): Promise<void> {
    const session = await ServerSession.fromNextAuth()
    const authResult = membershipAuthorizer.dynamicFields({ groupId }).auth(session)
    if (!authResult.authorized) {
        throw new Smorekopp(authResult.status, authResult.getErrorMessage)
    }
}

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
    return safeServerCall(async () => {
        await assertCanManageMembership(groupId)
        return createMembershipsForGroup(groupId, users)
    })
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
    return await safeServerCall(async () => {
        await assertCanManageMembership(groupId)
        return destoryMembershipOfUser({
            groupId,
            userId,
            orderArg
        })
    })
}

export async function updateMembershipAdminAcion(membership: {
    groupId: number
    userId: number
}, admin: boolean): Promise<ActionReturn<ExpandedMembership>> {
    return await safeServerCall(async () => {
        await assertCanManageMembership(membership.groupId)
        return updateMembership({
            ...membership,
            orderArg: 'ACTIVE'
        }, { admin })
    })
}

export async function updateMembershipActiveAction(membership: {
    groupId: number
    userId: number
}, active: boolean): Promise<ActionReturn<ExpandedMembership>> {
    return await safeServerCall(async () => {
        await assertCanManageMembership(membership.groupId)
        return updateMembership({
            ...membership,
            orderArg: 'ACTIVE'
        }, { active })
    })
}
