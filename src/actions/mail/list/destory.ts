"use server"
import { MailingList } from "@prisma/client";
import { ActionReturn } from "@/actions/Types";
import { getUser } from "@/auth/getUser";
import { createActionError, createZodActionError } from "../../error";
import { safeServerCall } from "../../safeServerCall";
import { destroyMailingList } from "@/server/mail/list/destroy";
import { readMailingListValidation } from "@/server/mail/list/validation";

export async function destroyMailingListAction(id: number): Promise<ActionReturn<MailingList>> {

    const { authorized, status } = await getUser({
        requiredPermissions: [[ 'MAILINGLIST_DESTROY' ]],
    })
    if (!authorized) return createActionError(status)

    const parse = readMailingListValidation.typeValidate({ id })
    if (!parse.success) return createZodActionError(parse)

    return safeServerCall(() => destroyMailingList(parse.data.id));
}
