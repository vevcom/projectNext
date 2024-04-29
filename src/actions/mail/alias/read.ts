"use server"

import { getUser } from "@/auth/getUser"
import { createActionError } from "../../error"
import { safeServerCall } from "../../safeServerCall"
import { readAllMailAliases } from "@/server/mail/alias/read"
import { ActionReturn } from "../../Types"
import { MailAlias } from "@prisma/client"

export async function readAllMailAliasesAction(): Promise<ActionReturn<MailAlias[]>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [[ 'MAILALIAS_READ' ]]
    })
    if (!authorized) return createActionError(status)

    return safeServerCall(() => readAllMailAliases())
}