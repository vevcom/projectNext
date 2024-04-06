"use server"

import { getUser } from "@/auth/getUser"
import { createActionError } from "../error"
import { safeServerCall } from "../safeServerCall"
import { readMailAliasById } from "@/server/mailalias/read"
import { ActionReturn } from "../Types"
import { MailAliasExtended } from "@/server/mailalias/Types"


export async function readMailAliasAction(id: number): Promise<ActionReturn<MailAliasExtended>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [[ 'MAILALIAS_READ' ]]
    })
    if (!authorized) return createActionError(status)

    return safeServerCall(() => readMailAliasById(id));
}