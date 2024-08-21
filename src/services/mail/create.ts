import 'server-only'
import {
    createAliasMailingListValidation,
    createMailingListExternalValidation,
    createMailingListGroupValidation,
    createMailingListUserValidation
} from './validation'
import { prismaCall } from '@/services/prismaCall'
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


export async function createAliasMailingListRelation(
    rawdata: CreateAliasMailingListType['Detailed']
): Promise<MailAliasMailingList> {
    const parse = createAliasMailingListValidation.detailedValidate(rawdata)

    return await prismaCall(() => prisma.mailAliasMailingList.create({
        data: {
            mailAlias: {
                connect: {
                    id: parse.mailAliasId,
                },
            },
            mailingList: {
                connect: {
                    id: parse.mailingListId,
                },
            },
        },
    }))
}

export async function createMailingListExternalRelation(
    rawdata: CreateMailingListExternalType['Detailed']
): Promise<MailingListMailAddressExternal> {
    const parse = createMailingListExternalValidation.detailedValidate(rawdata)

    return await prismaCall(() => prisma.mailingListMailAddressExternal.create({
        data: {
            mailingList: {
                connect: {
                    id: parse.mailingListId,
                },
            },
            mailAddressExternal: {
                connect: {
                    id: parse.mailAddressExternalId,
                },
            },
        }
    }))
}

export async function createMailingListUserRelation(
    rawdata: CreateMailingListUserType['Detailed']
): Promise<MailingListUser> {
    const parse = createMailingListUserValidation.detailedValidate(rawdata)

    return await prismaCall(() => prisma.mailingListUser.create({
        data: {
            mailingList: {
                connect: {
                    id: parse.mailingListId,
                },
            },
            user: {
                connect: {
                    id: parse.userId,
                },
            },
        }
    }))
}

export async function createMailingListGroupRelation(
    rawdata: CreateMailingListGroupType['Detailed']
): Promise<MailingListGroup> {
    const parse = createMailingListGroupValidation.detailedValidate(rawdata)

    return await prismaCall(() => prisma.mailingListGroup.create({
        data: {
            mailingList: {
                connect: {
                    id: parse.mailingListId,
                },
            },
            group: {
                connect: {
                    id: parse.groupId,
                },
            },
        }
    }))
}
