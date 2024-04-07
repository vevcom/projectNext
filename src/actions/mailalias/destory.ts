"use server"
import { MailAlias, RawAddressMailAlias } from "@prisma/client";
import { ActionReturn } from "@/actions/Types";
import { getUser } from "@/auth/getUser";
import { createActionError, createZodActionError } from "../error";
import { safeServerCall } from "../safeServerCall";
import { destroyMailAliasById, destroyMailAliasRawAddress } from "@/server/mailalias/destroy";
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

export async function destroyMailAliasRawAddressAction(id: number): Promise<ActionReturn<RawAddressMailAlias>> {

    const { authorized, status } = await getUser({
        requiredPermissions: [[ 'MAILALIAS_DESTORY_RAWADDRESS' ]],
    })
    if (!authorized) return createActionError(status)

    const parse = destoryMailAliasValidation.typeValidate({ id })
    if (!parse.success) return createZodActionError(parse)

    return safeServerCall(() => destroyMailAliasRawAddress(parse.data.id))

}