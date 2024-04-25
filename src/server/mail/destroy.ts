import 'server-only'
import { CreateAliasMailingListType, createAliasMailingListValidation } from './validation'
import { MailAliasMailingList } from '@prisma/client'
import { prismaCall } from '../prismaCall'
import prisma from '@/prisma'



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