"use server"

import { getUser } from "@/auth/getUser"
import { createActionError } from "../error"
import { safeServerCall } from "../safeServerCall"
import { findValidMailAliasForwardRelations, readMailAliasById } from "@/server/mailalias/read"
import { ActionReturn } from "../Types"
import { MailAliasExtended } from "@/server/mailalias/Types"
import { MailAlias } from "@prisma/client"


export async function readMailAliasAction(id: number): Promise<ActionReturn<{
    alias: MailAliasExtended,
    validForwardingAliases: MailAlias[],
}>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [[ 'MAILALIAS_READ' ]]
    })
    if (!authorized) return createActionError(status)

    return safeServerCall(async () => {
        const [alias, validForwardingAliases] = await Promise.all([
            readMailAliasById(id),
            findValidMailAliasForwardRelations(id),
        ])
        return {
            alias,
            validForwardingAliases,
        }
    })
}