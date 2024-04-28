"use server"

import { MailListTypes } from "@/server/mail/Types";
import { safeServerCall } from "../safeServerCall";
import { readMailFlow } from "@/server/mail/read";
import type { MailingList, MailAlias, MailAddressExternal} from "@prisma/client";
import { readAllMailAliases } from "@/server/mail/alias/read";
import { readAllMailingLists } from "@/server/mail/list/read";
import { readAllMailAddressExternal } from "@/server/mail/mailAddressExternal/read";
import { UserFiltered } from "@/server/users/Types";
import { getUser } from "@/auth/getUser";
import { createActionError } from "../error";
import { ActionReturn } from "../Types";


export async function readMailFlowAction(filter: MailListTypes, id: number) {

    const { authorized, status } = await getUser({
        requiredPermissions: [
            [ 'MAILINGLIST_READ' ],
            [ 'MAILALIAS_READ' ],
            [ 'MAILADDRESS_EXTERNAL_READ' ],
            [ 'GROUP_READ' ],
        ],
    })

    if (!authorized) return createActionError(status)

    return safeServerCall(() => readMailFlow({
        filter,
        id,
    }))
}

export async function readAllMailOptions(): Promise<ActionReturn<{
    alias: MailAlias[],
    mailingList: MailingList[],
    mailaddressExternal: MailAddressExternal[],
    users: UserFiltered[],
}>> {

    const { authorized, status } = await getUser({
        requiredPermissions: [
            [ 'MAILINGLIST_READ' ],
            [ 'MAILALIAS_READ' ],
            [ 'MAILADDRESS_EXTERNAL_READ' ],
        ],
    })
    if (!authorized) return createActionError(status);

    return await safeServerCall(async () => {
        const results = await Promise.all([
            readAllMailAliases(),
            readAllMailingLists(),
            readAllMailAddressExternal(),
        ])
    
        return {
            alias: results[0],
            mailingList: results[1],
            mailaddressExternal: results[2],
            users: []
        }
    })

}