import { ServerError } from '@/server/error'
import { readCurrenOmegaOrder } from '@/server/omegaOrder/read'
import prisma from '@/prisma'
import { prismaCall } from '@/server/prismaCall'
import type { BasicMembership, ExpandedGroup, ExpandedMembership } from './Types'
import { User } from '@prisma/client'

export async function readGroups(): Promise<ExpandedGroup[]> {
    return await prismaCall(() => prisma.group.findMany())
}

export async function readGroup(id: number): Promise<ExpandedGroup> {
    return await prismaCall(() => prisma.group.findUniqueOrThrow({
        where: {
            id,
        },
    }))
}

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

export async function readMembershipsOfUser(
    id: number,
    order?: number
): Promise<BasicMembership[]> {
    if (order === undefined) {
        order = (await readCurrenOmegaOrder()).order
    }

    return await prismaCall(() => prisma.membership.findMany({
        where: {
            userId: id,
            order,
        },
        select: {
            admin: true,
            groupId: true,
        }
    }))
}

export async function readUsersOfMemberships(memberships: BasicMembership[]): Promise<User[]> {
    return await prismaCall(() => prisma.user.findMany({
        where: {
            id: {
                in: memberships.map(membership => membership.groupId)
            }
        }
    }))
}
