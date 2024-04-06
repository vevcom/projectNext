"use server"
import { MailAlias } from "@prisma/client";
import { ActionReturn } from "@/actions/Types";
import { getUser } from "@/auth/getUser";
import { createActionError, createZodActionError } from "../error";
import { safeServerCall } from "../safeServerCall";
import { destroyMailAliasById } from "@/server/mailalias/destroy";
import { destoryMailAliasValidation } from "@/server/mailalias/validation";

export async function destroyMailAliasAction(id: number): Promise<ActionReturn<MailAlias>> {

    const { authorized, status } = await getUser({
        requiredPermissions: [[ 'MAILALIAS_DESTORY' ]],
    })
    if (!authorized) return createActionError(status)

    const parse = destoryMailAliasValidation.typeValidate({ id })
    if (!parse.success) return createZodActionError(parse)

    return safeServerCall(() => destroyMailAliasById(parse.data.id));
}