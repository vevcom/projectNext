"use server"

import { MailAliasMailingList, MailingListGroup, MailingListMailAddressExternal, MailingListUser } from "@prisma/client"
import { ActionReturn } from "../Types"
import { getUser } from "@/auth/getUser"
import { createActionError, createZodActionError } from "../error"
import { CreateAliasMailingListType, CreateMailingListExternalType, CreateMailingListGroupType, CreateMailingListUserType, createAliasMailingListValidation, createMailingListExternalValidation, createMailingListGroupValidation, createMailingListUserValidation } from "@/server/mail/validation"
import { safeServerCall } from "../safeServerCall"
import { destroyAliasMailingListRelation, destroyMailingListExternalRelation, destroyMailingListGroupRelation, destroyMailingListUserRelation } from "@/server/mail/destroy"


export async function destroyAliasMailingListRelationAction(formdata: FormData | CreateAliasMailingListType['Type']):
    Promise<ActionReturn<MailAliasMailingList>>
{
    const {authorized, status} = await getUser({
        requiredPermissions: [[ 'MAILINGLIST_ALIAS_DESTROY' ]]
    })
    if (!authorized) return createActionError(status)
        
    const parse = createAliasMailingListValidation.typeValidate(formdata)
    if (!parse.success) return createZodActionError(parse)
    
    return safeServerCall(() => destroyAliasMailingListRelation(parse.data));
}

export async function destroyMailingListExternalRelationAction(formdata: FormData | CreateMailingListExternalType['Type']):
    Promise<ActionReturn<MailingListMailAddressExternal>>
{
    const {authorized, status} = await getUser({
        requiredPermissions: [[ 'MAILINGLIST_EXTERNAL_ADDRESS_DESTROY' ]]
    })
    if (!authorized) return createActionError(status)
        
    const parse = createMailingListExternalValidation.typeValidate(formdata)
    if (!parse.success) return createZodActionError(parse)
    
    return safeServerCall(() => destroyMailingListExternalRelation(parse.data));
}

export async function destroyMailingListUserRelationAction(formdata: FormData | CreateMailingListUserType['Type']):
    Promise<ActionReturn<MailingListUser>>
{
    const {authorized, status} = await getUser({
        requiredPermissions: [[ 'MAILINGLIST_USER_DESTROY' ]] // Fixed the typo in 'MAILINGLIST_USER_DESTORY'
    })
    if (!authorized) return createActionError(status)

    const parse = createMailingListUserValidation.typeValidate(formdata)
    if (!parse.success) return createZodActionError(parse)
    
    return safeServerCall(() => destroyMailingListUserRelation(parse.data));
}

export async function destroyMailingListGroupRelationAction(formdata: FormData | CreateMailingListGroupType['Type']):
    Promise<ActionReturn<MailingListGroup>>
{
    const {authorized, status} = await getUser({
        requiredPermissions: [[ 'MAILINGLIST_GROUP_DESTROY' ]]
    })
    if (!authorized) return createActionError(status)
        
    const parse = createMailingListGroupValidation.typeValidate(formdata)
    if (!parse.success) return createZodActionError(parse)
    
    return safeServerCall(() => destroyMailingListGroupRelation(parse.data));
}
