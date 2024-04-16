import 'server-only'
import { MailingList } from '@prisma/client';
import { prismaCall } from '../../prismaCall';
import prisma from '@/prisma';
import { readMailingListValidation } from './validation';


export async function destroyMailingListById(id: number): Promise<MailingList> {
    const parse = readMailingListValidation.detailedValidate({ id })

    return await prismaCall(() => prisma.mailingList.delete({
        where: {
            id: parse.id,
        },
    }))
}