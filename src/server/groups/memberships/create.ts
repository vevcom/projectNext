import 'server-only'
import { canEasalyManageMembershipOfGroup, canEasalyManageMembershipOfGroups } from './canEasalyManageMembership'
import { readCurrentOmegaOrder } from '@/server/omegaOrder/read'
import { prismaCall } from '@/server/prismaCall'
import { ServerError } from '@/server/error'
import prisma from '@/prisma'
import type { ExpandedMembership } from './Types'

export async function createMembershipForUser(
    groupId: number,
    userId: number,
    admin: boolean,
    orderArg?: number
): Promise<ExpandedMembership> {
    if (!await canEasalyManageMembershipOfGroup(groupId)) {
        throw new ServerError('BAD PARAMETERS', 'Denne Gruppetypen kan ikke enkelt opprette medlemskap')
    }
    const order = orderArg ?? (await readCurrentOmegaOrder()).order

    return await prismaCall(() => prisma.membership.create({
        data: {
            group: {
                connect: {
                    id: groupId,
                }
            },
            user: {
                connect: {
                    id: userId,
                },
            },
            omegaOrder: {
                connect: {
                    order,
                }
            },
            admin,
        },
    }))
}

export async function createMembershipsForGroup(
    groupId: number,
    data: { userId: number, admin: boolean }[],
    orderArg?: number,
): Promise<void> {
    if (!await canEasalyManageMembershipOfGroup(groupId)) {
        throw new ServerError('BAD PARAMETERS', 'Denne Gruppetypen kan ikke enkelt opprette medlemskap')
    }
    const order = orderArg ?? (await readCurrentOmegaOrder()).order

    await prismaCall(() => prisma.membership.createMany({
        data: data.map(({ userId, admin }) => ({
            groupId,
            userId,
            admin,
            order,
        })),
        skipDuplicates: true,
    }))
}

export async function createMembershipsForUser(
    userId: number,
    data: { groupId: number, admin: boolean }[],
    orderArg?: number,
): Promise<void> {
    if (!await canEasalyManageMembershipOfGroups(data.map(group => group.groupId))) {
        throw new ServerError('BAD PARAMETERS', 'Denne Gruppetypen kan ikke enkelt opprette medlemskap')
    }
    const order = orderArg ?? (await readCurrentOmegaOrder()).order

    await prismaCall(() => prisma.membership.createMany({
        data: data.map(({ groupId, admin }) => ({
            groupId,
            userId,
            admin,
            order,
        })),
        skipDuplicates: true,
    }))
}
