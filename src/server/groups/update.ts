import { readCurrenOmegaOrder } from '@/server/omegaOrder/read'
import { createPrismaActionError } from '@/actions/error'
import prisma from '@/prisma'
import type { ExpandedMembership } from './Types'
import type { ActionReturn } from '@/actions/Types'

export async function addMemberToGroup(
    groupId: number,
    userId: number,
    admin: boolean
): Promise<ActionReturn<ExpandedMembership>> {
    const currentOrderRes = await readCurrenOmegaOrder()

    if (!currentOrderRes.success) return currentOrderRes

    const currentOrder = currentOrderRes.data

    try {
        const membership = await prisma.membership.create({
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
        })

        return { success: true, data: membership }
    } catch (e) {
        return createPrismaActionError(e)
    }
}

export async function addMembersToGroup(
    groupId: number,
    data: { userId: number, admin: boolean }[]
): Promise<ActionReturn<void, false>> {
    const currentOrderRes = await readCurrenOmegaOrder()

    if (!currentOrderRes.success) return currentOrderRes

    const currentOrder = currentOrderRes.data

    try {
        await prisma.membership.createMany({
            data: data.map(({ userId, admin }) => ({
                groupId,
                userId,
                admin,
                order: currentOrder.order,
            })),
        })

        return { success: true }
    } catch (e) {
        return createPrismaActionError(e)
    }
}

export async function removeMemberFromGroup(groupId: number, userId: number): Promise<ActionReturn<ExpandedMembership>> {
    try {
        const membership = await prisma.membership.delete({
            where: {
                userId_groupId: {
                    groupId,
                    userId,
                }
            },
        })

        return { success: true, data: membership }
    } catch (e) {
        return createPrismaActionError(e)
    }
}

export async function removeMembersFromGroup(
    groupId: number,
    userIds: number[]
): Promise<ActionReturn<void, false>> {
    try {
        await prisma.membership.deleteMany({
            where: {
                groupId,
                userId: {
                    in: userIds,
                },
            },
        })

        return { success: true }
    } catch (e) {
        return createPrismaActionError(e)
    }
}

export async function updateMembership(
    groupId: number,
    userId: number,
    admin: boolean,
    order?: number
): Promise<ActionReturn<ExpandedMembership>> {
    if (!order) {
        const currentOrderRes = await readCurrenOmegaOrder()

        if (!currentOrderRes.success) return currentOrderRes

        order = currentOrderRes.data.order
    }

    try {
        const membership = await prisma.membership.update({
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
        })

        return { success: true, data: membership }
    } catch (e) {
        return createPrismaActionError(e)
    }
}
