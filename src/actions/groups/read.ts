'use server'
import { ActionReturn } from "../Types";
import { safeServerCall } from "../safeServerCall";
import { getUser } from "@/auth/getUser";
import { createActionError } from "../error";
import { ExpandedGroup } from "@/server/groups/Types";
import { readGroups } from "@/server/groups/read";

export async function readGroupsAction(): Promise<ActionReturn<ExpandedGroup[]>> {
    const { status, authorized  } = await getUser({
        requiredPermissions: [['GROUP_READ']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(readGroups)
}