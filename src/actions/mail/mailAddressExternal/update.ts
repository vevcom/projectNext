"use server"

import { ActionReturn } from "@/actions/Types";
import { createActionError, createZodActionError } from "@/actions/error";
import { safeServerCall } from "@/actions/safeServerCall";
import { getUser } from "@/auth/getUser";
import { updateMailAddressExternal } from "@/server/mail/mailAddressExternal/update";
import { updateMailAddressExternalValidation } from "@/server/mail/mailAddressExternal/validation";
import { MailAddressExternal } from "@prisma/client";



export async function updateMailAddressExternalAction(data: FormData): 
Promise<ActionReturn<MailAddressExternal>> {

    const { authorized, status } = await getUser({
        requiredPermissions: [[ 'MAILADDRESS_EXTERNAL_UPDATE' ]],
    })
    if(!authorized) return createActionError(status)

    const parse = updateMailAddressExternalValidation.typeValidate(data)
    if (!parse.success) return createZodActionError(parse)

    return safeServerCall(() => updateMailAddressExternal(parse.data))
}