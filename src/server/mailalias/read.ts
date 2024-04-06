import { MailAlias } from '@prisma/client';
import 'server-only'
import { prismaCall } from '../prismaCall';
import { MailAliasExtended } from './Types';



/**
 * Retrieves a mail alias by its ID.
 * @param id - The ID of the mail alias.
 * @returns A promise that resolves to the mail alias object.
 */
export async function readMailAliasById(id: number): Promise<MailAliasExtended> {
    return await prismaCall(() => prisma.mailAlias.findUniqueOrThrow({
        where: {
            id,
        },
        include: {
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
            forwardsFrom: {
                include: {
                    source: true,
                },
            },
            forwardsTo: {
                include: {
                    drain: true,
                }
            },
            rawAddress: true,
        }
    }));
}