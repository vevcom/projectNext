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

export async function findValidMailAliasForwardRelations(id: number): Promise<MailAlias[]> {

    const [ aliases, relations ] = await Promise.all([
        prismaCall(() => prisma.mailAlias.findMany()),
        prismaCall(() => prisma.forwardMailAlias.findMany()),
    ])
    
    const relationObject: Record<number, {
        source: number[],
        drain: number[],
        valid: boolean
    }> = {}

    aliases.forEach(a => {
        relationObject[a.id] = {
            source: [],
            drain: [],
            valid: true,
        }
    })

    relations.forEach(r => {
        relationObject[r.sourceId].drain.push(r.drainId)
        relationObject[r.drainId].source.push(r.sourceId)
    })

    function invalidateAlias(id: number) {
        if (!relationObject[id].valid) return;
        relationObject[id].valid = false;

        relationObject[id].source.forEach(invalidateAlias)
        relationObject[id].drain.forEach(invalidateAlias)
    }

    invalidateAlias(id)

    const validAliasIds = Object
        .entries(relationObject)
        .filter(([id, data]) => data.valid)
        .map(([id, data]) => id)
        .map(id => Number(id))

    return aliases.filter(a => validAliasIds.includes(a.id));
}