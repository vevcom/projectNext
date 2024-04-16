"use server"

import type { MailAlias } from "@prisma/client";
import type { ActionReturn } from "@/actions//Types";
import { createMailAliasValidation } from "@/server/mail/alias/validation";
import { createZodActionError } from "@/actions/error";
import { safeServerCall } from "@/actions/safeServerCall";
import { createMailAlias } from "@/server/mail/alias/create";
import { getUser } from "@/auth/getUser";
import { createActionError } from "@/actions/error";


export async function createMailAliasAction(rawdata: FormData):
    Promise<ActionReturn<MailAlias>>
{
    const {authorized, status} = await getUser({
        requiredPermissions: [[ 'MAILALIAS_CREATE' ]]
    })
    if (!authorized) return createActionError(status)

    const parse = createMailAliasValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    
    return safeServerCall(() => createMailAlias(parse.data))
}

