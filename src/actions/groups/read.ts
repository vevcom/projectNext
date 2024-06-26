'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createActionError } from '@/actions/error'
import { getUser } from '@/auth/getUser'
import { readGroups, readGroupsExpanded, readGroupsStructured } from '@/server/groups/read'
import type { ExpandedGroup, GroupsStructured } from '@/server/groups/Types'
import type { Group } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'

export async function readGroupsAction(): Promise<ActionReturn<Group[]>> {
    const { status, authorized } = await getUser({
        requiredPermissions: [['GROUP_READ']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(readGroups)
}

export async function readGroupsExpandedAction(): Promise<ActionReturn<ExpandedGroup[]>> {
    const { status, authorized } = await getUser({
        requiredPermissions: [['GROUP_READ']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readGroupsExpanded())
}

export async function readGroupsAdmin(): Promise<ActionReturn<GroupsStructured>> {
    const { status, authorized } = await getUser({
        requiredPermissions: [['GROUP_ADMIN']] //TODO: We need to discuss permission structure for groups
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readGroupsStructured())
}
