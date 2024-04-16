"use server"

import type { MailingList } from "@prisma/client";
import type { ActionReturn } from "@/actions//Types";
import { createMailingListValidation } from "@/server/mail/list/validation";
import { createZodActionError } from "@/actions/error";
import { safeServerCall } from "@/actions/safeServerCall";
import { createMailingList } from "@/server/mail/list/create";
import { getUser } from "@/auth/getUser";
import { createActionError } from "@/actions/error";


export async function createMailingListAction(rawdata: FormData):
    Promise<ActionReturn<MailingList>>
{
    const {authorized, status} = await getUser({
        requiredPermissions: [[ 'MAILINGLIST_CREATE' ]]
    })
    if (!authorized) return createActionError(status)

    const parse = createMailingListValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    
    return safeServerCall(() => createMailingList(parse.data))
}

