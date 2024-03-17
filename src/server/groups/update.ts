import { readCurrenOmegaOrder } from '@/server/omegaOrder/read'
import prisma from '@/prisma'
import { prismaCall } from '@/server/prismaCall'
import type { ExpandedMembership } from './Types'

export async function addMemberToGroup(
    groupId: number,
    userId: number,
    admin: boolean
): Promise<ExpandedMembership> {
    const currentOrder = await readCurrenOmegaOrder()

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
                connect: currentOrder,
            },
            admin,
        },
    }))
}

export async function addMembersToGroup(
    groupId: number,
    data: { userId: number, admin: boolean }[]
): Promise<void> {
    const currentOrder = (await readCurrenOmegaOrder()).order

    await prismaCall(() => prisma.membership.createMany({
        data: data.map(({ userId, admin }) => ({
            groupId,
            userId,
            admin,
            order: currentOrder,
        })),
    }))
}

export async function removeMemberFromGroup(groupId: number, userId: number): Promise<ExpandedMembership> {
    return await prismaCall(() => prisma.membership.delete({
        where: {
            userId_groupId: {
                groupId,
                userId,
            }
        },
    }))
}

export async function removeMembersFromGroup(
    groupId: number,
    userIds: number[]
): Promise<void> {
    await prismaCall(() => prisma.membership.deleteMany({
        where: {
            groupId,
            userId: {
                in: userIds,
            },
        },
    }))
}

export async function updateMembership(
    groupId: number,
    userId: number,
    admin: boolean,
    order?: number
): Promise<ExpandedMembership> {
    if (order === undefined) {
        order = (await readCurrenOmegaOrder()).order
    }

    return await prismaCall(() => prisma.membership.update({
        where: {
            userId_groupId: {
                groupId,
                userId,
            },
            order,
        },
        data: {
            admin,
        }
    }))
}
