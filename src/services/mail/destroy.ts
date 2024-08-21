import 'server-only'
import {
    createAliasMailingListValidation,
    createMailingListExternalValidation,
    createMailingListGroupValidation,
    createMailingListUserValidation
} from './validation'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type {
    MailAliasMailingList,
    MailingListGroup,
    MailingListMailAddressExternal,
    MailingListUser
} from '@prisma/client'
import type {
    CreateAliasMailingListType,
    CreateMailingListExternalType,
    CreateMailingListGroupType,
    CreateMailingListUserType
} from './validation'


export async function destroyAliasMailingListRelation(
    rawdata: CreateAliasMailingListType['Detailed']
): Promise<MailAliasMailingList> {
    const parse = createAliasMailingListValidation.detailedValidate(rawdata)

    return await prismaCall(() => prisma.mailAliasMailingList.delete({
        where: {
            mailAliasId_mailingListId: parse,
        },
    }))
}

export async function destroyMailingListExternalRelation(
    rawdata: CreateMailingListExternalType['Detailed']
): Promise<MailingListMailAddressExternal> {
    const parse = createMailingListExternalValidation.detailedValidate(rawdata)

    return await prismaCall(() => prisma.mailingListMailAddressExternal.delete({
        where: {
            mailingListId_mailAddressExternalId: parse,
        },
    }))
}

export async function destroyMailingListUserRelation(
    rawdata: CreateMailingListUserType['Detailed']
): Promise<MailingListUser> {
    const parse = createMailingListUserValidation.detailedValidate(rawdata)

    return await prismaCall(() => prisma.mailingListUser.delete({
        where: {
            mailingListId_userId: parse
        }
    }))
}

export async function destroyMailingListGroupRelation(
    rawdata: CreateMailingListGroupType['Detailed']
): Promise<MailingListGroup> {
    const parse = createMailingListGroupValidation.detailedValidate(rawdata)

    return await prismaCall(() => prisma.mailingListGroup.delete({
        where: {
            mailingListId_groupId: parse
        }
    }))
}
