"use server"
import { MailAddressExternal } from "@prisma/client";
import { ActionReturn } from "@/actions/Types";
import { getUser } from "@/auth/getUser";
import { createActionError, createZodActionError } from "../../error";
import { safeServerCall } from "../../safeServerCall";
import { readMailAddressExternalValidation } from "@/server/mail/mailAddressExternal/validation";
import { destroyMailAddressExternal } from "@/server/mail/mailAddressExternal/destroy";

export async function destroyMailAddressExternalAction(id: number): Promise<ActionReturn<MailAddressExternal>> {

    const { authorized, status } = await getUser({
        requiredPermissions: [[ 'MAILADDRESS_EXTERNAL_DESTROY' ]],
    })
    if (!authorized) return createActionError(status)

    const parse = readMailAddressExternalValidation.typeValidate({ id })
    if (!parse.success) return createZodActionError(parse)

    return safeServerCall(() => destroyMailAddressExternal(parse.data.id));
}
