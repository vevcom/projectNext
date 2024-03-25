'use server'
import { ActionReturn } from "../Types";
import { safeServerCall } from "../safeServerCall";
import { getUser } from "@/auth/getUser";
import { createActionError } from "../error";
import { readGroups, readGroupsExpanded, readGroupsStructured } from "@/server/groups/read";
import { Group } from "@prisma/client";
import { ExpandedGroup, GroupsStructured } from "@/server/groups/Types";

export async function readGroupsAction(): Promise<ActionReturn<Group[]>> {
    const { status, authorized  } = await getUser({
        requiredPermissions: [['GROUP_READ']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(readGroups)
}

export async function readGroupsExpandedAction(): Promise<ActionReturn<ExpandedGroup[]>> {
    const { status, authorized  } = await getUser({
        requiredPermissions: [['GROUP_READ']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readGroupsExpanded())
}

export async function readForGroupAdmin(): Promise<ActionReturn<GroupsStructured>> {
    const { status, authorized  } = await getUser({
        requiredPermissions: [['GROUP_ADMIN']] //TODO: We need to discuss permission structure for groups
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readGroupsStructured())
}
