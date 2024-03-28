import 'server-only'
import { prismaCall } from '@/server/prismaCall'
import { ServerError } from '@/server/error'
import { getActiveMembershipFilter } from '@/auth/getActiveMembershipFilter'
import { readCurrentOmegaOrder } from '@/server/omegaOrder/read'
import prisma from '@/prisma'
import type { ExpandedMembership, BasicMembership } from './Types'

export async function readMembershipsOfGroup(id: number): Promise<ExpandedMembership[]> {
    const count = await prismaCall(() => prisma.group.count({
        where: {
            id,
        },
    }))

    if (count !== 1) throw new ServerError('BAD PARAMETERS', 'Kan ikke lese medlemmer til en gruppe som ikke finnes.')


    return await prismaCall(() => prisma.membership.findMany({
        where: {
            groupId: id,
        },
    }))
}

export async function readMembershipsOfGroups(ids: number[]): Promise<ExpandedMembership[]> {
    return await prismaCall(() => prisma.membership.findMany({
        where: {
            groupId: {
                in: ids,
            },
        },
    }))
}

/**
 * Reads valid memberships of a user of a order
 * @param id - The id of the user
 * @param order - The order of what is considered valid membership.
 * If 'ACTIVE' is given, only active memberships are returned.
 * If undefined is given, all memberships are returned.
 * @returns - The memberships of a user of a order of 'ACTIVE' memberships, or all memberships.
 */
export async function readMembershipsOfUser(
    id: number,
    order?: number | 'ACTIVE'
): Promise<BasicMembership[]> {
    return await prismaCall(() => prisma.membership.findMany({
        where: order ? {
            userId: id,
            ...getActiveMembershipFilter(order)
        } : { userId: id },
        select: {
            admin: true,
            groupId: true,
            active: true,
        }
    }))
}
