'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createActionError } from '@/actions/error'
import { getUser } from '@/auth/getUser'
import { readGroupExpanded, readGroups, readGroupsExpanded, readGroupsStructured } from '@/services/groups/read'
import type { ExpandedGroup, GroupsStructured } from '@/services/groups/Types'
import type { Group } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'

export async function readGroupsAction(): Promise<ActionReturn<Group[]>> {
    const { status, authorized } = await getUser({
        requiredPermissions: [['GROUP_READ']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(readGroups)
}

export async function readGroupExpandedAction(id: number): Promise<ActionReturn<ExpandedGroup>> {
    const { status, authorized } = await getUser({
        requiredPermissions: [['GROUP_READ']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readGroupExpanded(id))
}

export async function readGroupsExpandedAction(): Promise<ActionReturn<ExpandedGroup[]>> {
    const { status, authorized } = await getUser({
        requiredPermissions: [['GROUP_READ']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readGroupsExpanded())
}

export async function readGroupsStructuredAction(): Promise<ActionReturn<GroupsStructured>> {
    const { status, authorized } = await getUser({
        requiredPermissions: [['GROUP_READ']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readGroupsStructured())
}
