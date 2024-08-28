'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { destoryMembershipOfUser } from '@/server/groups/memberships/destroy'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedMembership } from '@/server/groups/memberships/Types'

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
