import { readCurrenOmegaOrder } from '@/server/omegaOrder/read'
import prisma from '@/prisma'
import { prismaCall } from '@/server/prismaCall'
import type { ExpandedMembership } from './Types'

export async function addMemberToGroup(
    groupId: number,
    userId: number,
    admin: boolean,
    orderArg: number,
): Promise<ExpandedMembership> {
    const order = orderArg ?? (await readCurrenOmegaOrder()).order

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

export async function addMembersToGroup(
    groupId: number,
    data: { userId: number, admin: boolean }[],
    orderArg?: number,
): Promise<void> {
    const order = orderArg ?? (await readCurrenOmegaOrder()).order

    await prismaCall(() => prisma.membership.createMany({
        data: data.map(({ userId, admin }) => ({
            groupId,
            userId,
            admin,
            order: order,
        })),
        skipDuplicates: true,
    }))
}

export async function addMemberToGroups(
    userId: number,
    data: { groupId: number, admin: boolean }[],
    orderArg?: number,
): Promise<void> {
    const order = orderArg ?? (await readCurrenOmegaOrder()).order

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

export async function removeMemberFromGroup(
    groupId: number,
    userId: number,
    orderArg?: number
): Promise<ExpandedMembership> {
    const order = orderArg ?? (await readCurrenOmegaOrder()).order

    return await prismaCall(() => prisma.membership.delete({
        where: {
            userId_groupId_order: {
                groupId,
                userId,
                order,
            }
        },
    }))
}

export async function removeMembersFromGroup(
    groupId: number,
    userIds: number[],
    orderArg?: number,
): Promise<void> {
    const order = orderArg ?? (await readCurrenOmegaOrder()).order

    await prismaCall(() => prisma.membership.deleteMany({
        where: {
            groupId,
            userId: {
                in: userIds,
            },
            order,
        },
    }))
}

export async function updateMembership(
    groupId: number,
    userId: number,
    admin: boolean,
    orderArg?: number
): Promise<ExpandedMembership> {
    const order = orderArg ?? (await readCurrenOmegaOrder()).order

    return await prismaCall(() => prisma.membership.update({
        where: {
            userId_groupId_order: {
                groupId,
                userId,
                order,
            },
        },
        data: {
            admin,
        }
    }))
}
