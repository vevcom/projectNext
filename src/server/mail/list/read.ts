import 'server-only'

import { prismaCall } from '../../prismaCall';
import { MailingListExtended } from './Types';
import { readMailingListValidation } from './validation';

export async function readMailingListById(id: number): Promise<MailingListExtended> {
    const parse = readMailingListValidation.detailedValidate({ id })

    return await prismaCall(() => prisma.mailingList.findUniqueOrThrow({
        where: {
            id: parse.id,
        },
        include: {
            mailAliases: {
                include: {
                    mailAlias: true,
                },
            },
            groups: {
                include: {
                    group: true,
                },
            },
            users: {
                include: {
                    user: true,
                },
            },
            mailAddressExternal: {
                include: {
                    mailAddressExternal: true,
                },
            },
        }
    }));
}