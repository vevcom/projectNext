"use server"

import type { ForwardMailAlias, MailAlias, RawAddressMailAlias } from "@prisma/client";
import type { ActionReturn } from "@/actions//Types";
import { createMailAliasForwardRelationValidation, createMailAliasRawAddressValidation, createMailAliasValidation } from "@/server/mailalias/validation";
import { createZodActionError } from "@/actions/error";
import { safeServerCall } from "@/actions/safeServerCall";
import { createMailAlias, createMailAliasForwardRelation, createMailAliasRawAddress } from "@/server/mailalias/create";
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

export async function createMailAliasRawAddressAction(rawdata: FormData):
    Promise<ActionReturn<RawAddressMailAlias>>
{
    const {authorized, status} = await getUser({
        requiredPermissions: [[ 'MAILALIAS_CREATE_RAWADDRESS' ]],
    })
    if (!authorized) return createActionError(status)

    const parse = createMailAliasRawAddressValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)

    return safeServerCall(() => createMailAliasRawAddress(parse.data))
}

export async function createMailAliasForwardRelationAction(rawdata: FormData):
    Promise<ActionReturn<ForwardMailAlias>>
{
    const { authorized, status } = await getUser({
        requiredPermissions: [[ 'MAILALIAS_CREATE_FORWARD' ]],
    })
    if (!authorized) return createActionError(status)

    const parse = createMailAliasForwardRelationValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)

    return safeServerCall(() => createMailAliasForwardRelation(parse.data))
}