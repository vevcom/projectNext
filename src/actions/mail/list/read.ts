"use server"

import { getUser } from "@/auth/getUser"
import { createActionError, createZodActionError } from "../../error"
import { safeServerCall } from "../../safeServerCall"
import { readMailingListById } from "@/server/mail/list/read"
import { ActionReturn } from "../../Types"
import { MailingListExtended } from "@/server/mail/list/Types"
import { readMailingListValidation } from "@/server/mail/list/validation"


export async function readMailingListAction(id: number): Promise<ActionReturn<MailingListExtended>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [[ 'MAILINGLIST_READ' ]]
    })
    if (!authorized) return createActionError(status)

    const parse = readMailingListValidation.typeValidate({id})

    if (!parse.success) return createZodActionError(parse)

    return safeServerCall(async () => readMailingListById(parse.data.id))
}