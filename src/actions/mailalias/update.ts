"use server"

import { MailAlias } from "@prisma/client";
import { ActionReturn } from "../Types";
import { getUser } from "@/auth/getUser";
import { createActionError, createZodActionError } from "@/actions/error";
import { updateMailAliasValidation } from "@/server/mailalias/validation";
import { safeServerCall } from "../safeServerCall";
import { updateMailAlias } from "@/server/mailalias/update";

export async function updateMailAliasAction(rawdata: FormData): Promise<ActionReturn<MailAlias>> {

    const { authorized, status } = await getUser({
        requiredPermissions: [[ 'MAILALIAS_UPDATE' ]],
    })
    if (!authorized) return createActionError(status)

    const parsed_data = updateMailAliasValidation.typeValidate(rawdata)
    if (!parsed_data.success) return createZodActionError(parsed_data)

    return await safeServerCall(() => updateMailAlias(parsed_data.data));
}