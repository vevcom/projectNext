"use server"
/*import { ForwardMailAlias, MailAlias, RawAddressMailAlias } from "@prisma/client";
import { ActionReturn } from "@/actions/Types";
import { getUser } from "@/auth/getUser";
import { createActionError, createZodActionError } from "../../error";
import { safeServerCall } from "../../safeServerCall";
import { destroyMailAliasById, destroyMailAliasForward, destroyMailAliasRawAddress } from "@/server/mail/alias/destroy";
import { CreateMailAliasForwardRelationTypes, createMailAliasForwardRelationValidation, destoryMailAliasValidation } from "@/server/mail/alias/validation";

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

export async function destroyMailAliasForwardAction(
    rawdata: CreateMailAliasForwardRelationTypes['Detailed']
): Promise<ActionReturn<ForwardMailAlias>> {

    const { authorized, status } = await getUser({
        requiredPermissions: [[ 'MAILALIAS_DESTORY_FORWARD' ]],
    })
    if (!authorized) return createActionError(status)

    const parse = createMailAliasForwardRelationValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)

    return safeServerCall(() => destroyMailAliasForward(parse.data))


}*/