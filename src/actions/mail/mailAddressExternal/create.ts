"use server"

import type { MailAddressExternal } from "@prisma/client";
import type { ActionReturn } from "@/actions//Types";
import { createMailAddressExternalValidation } from "@/server/mail/mailAddressExternal/validation";
import { createZodActionError } from "@/actions/error";
import { safeServerCall } from "@/actions/safeServerCall";
import { createMailAddressExternal } from "@/server/mail/mailAddressExternal/create";
import { getUser } from "@/auth/getUser";
import { createActionError } from "@/actions/error";


export async function createMailAddressExternalAction(rawdata: FormData):
    Promise<ActionReturn<MailAddressExternal>>
{
    const {authorized, status} = await getUser({
        requiredPermissions: [[ 'MAILADDRESS_EXTERNAL_CREATE' ]]
    })
    if (!authorized) return createActionError(status)

    const parse = createMailAddressExternalValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    
    return safeServerCall(() => createMailAddressExternal(parse.data))
}

