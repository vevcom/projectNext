'use server'
import { ActionReturn } from "../Types";
import { safeServerCall } from "../safeServerCall";
import { getUser } from "@/auth/getUser";
import { createActionError } from "../error";
import { readGroups } from "@/server/groups/read";
import { Group } from "@prisma/client";

export async function readGroupsAction(): Promise<ActionReturn<Group[]>> {
    const { status, authorized  } = await getUser({
        requiredPermissions: [['GROUP_READ']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(readGroups)
}