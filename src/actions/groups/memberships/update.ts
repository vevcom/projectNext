'use server'
import type { ActionReturn } from "@/actions/Types"
import { safeServerCall } from "@/actions/safeServerCall"
import { ExpandedMembership } from "@/server/groups/memberships/Types"
import { updateMembership } from "@/server/groups/memberships/update"

export async function updateMembershipAdminAcion(membership: {
    groupId: number
    userId: number
}, admin: boolean) : Promise<ActionReturn<ExpandedMembership>>{
    //TODO: make function to check that user is admin of group
    return await safeServerCall(() => updateMembership({
        ...membership,
        orderArg: 'ACTIVE'
    }, { admin }))
}

export async function updateMembershipActiveAction(membership: {
    groupId: number
    userId: number
}, active: boolean) : Promise<ActionReturn<ExpandedMembership>>{
    //TODO: make function to check that user is admin of group
    return await safeServerCall(() => updateMembership({
        ...membership,
        orderArg: 'ACTIVE'
    }, { active }))
}