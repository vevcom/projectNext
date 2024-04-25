"use server"

import { MailAliasMailingList } from "@prisma/client"
import { ActionReturn } from "../Types"
import { getUser } from "@/auth/getUser"
import { createActionError, createZodActionError } from "../error"
import { CreateAliasMailingListType, createAliasMailingListValidation } from "@/server/mail/validation"
import { safeServerCall } from "../safeServerCall"
import { destroyAliasMailingListRelation } from "@/server/mail/destroy"


export async function destroyAliasMailingListRelationAction(formdata: FormData | CreateAliasMailingListType['Type']):
    Promise<ActionReturn<MailAliasMailingList>>
{
    const {authorized, status} = await getUser({
        requiredPermissions: [[ 'MAILINGLIST_ALIAS_CREATE' ]]
    })
    if (!authorized) return createActionError(status)
        
    const parse = createAliasMailingListValidation.typeValidate(formdata)
    if (!parse.success) return createZodActionError(parse)
    
    return safeServerCall(() => destroyAliasMailingListRelation(parse.data));
}