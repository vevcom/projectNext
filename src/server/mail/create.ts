import 'server-only'
import { CreateAliasMailingListType, CreateMailingListExternalType, createAliasMailingListValidation, createMailingListExternalValidation } from './validation';
import { MailAliasMailingList, MailingListMailAddressExternal } from '@prisma/client';
import { prismaCall } from '../prismaCall';
import prisma from '@/prisma';
import { connect } from 'http2';


export async function createAliasMailingListRelation(
    rawdata: CreateAliasMailingListType['Detailed']
): Promise<MailAliasMailingList> {
    const parse = createAliasMailingListValidation.detailedValidate(rawdata)

    return await prismaCall(() => prisma.mailAliasMailingList.create({
        data: {
            mailAlias: {
                connect: {
                    id: parse.aliasId,
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