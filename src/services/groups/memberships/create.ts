import '@pn-server-only'
import { canEasilyManageMembershipOfGroup, canEasilyManageMembershipOfGroups } from './canEasilyManageMembership'
import { readCurrentOmegaOrder } from '@/services/omegaOrder/read'
import { prismaCall } from '@/services/prismaCall'
import { ServerError } from '@/services/error'
import { prisma } from '@/prisma/client'
import { invalidateManyUserSessionData, invalidateOneUserSessionData } from '@/services/auth/invalidateSession'
import { groupMethods } from '@/services/groups/methods'
import type { ExpandedMembership } from './Types'

export async function createMembershipForUser(
    groupId: number,
    userId: number,
    admin: boolean,
    orderArg?: number
): Promise<ExpandedMembership> {
    if (!await canEasilyManageMembershipOfGroup(groupId)) {
        throw new ServerError('BAD PARAMETERS', 'Denne Gruppetypen kan ikke enkelt opprette medlemskap')
    }

    const order = orderArg ?? await groupMethods.readCurrentGroupOrder({
        bypassAuth: true,
        params: {
            id: groupId,
        }
    })

    const membership = await prismaCall(() => prisma.membership.create({
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
            active: true,
        },
    }))
    await invalidateOneUserSessionData(userId)
    return membership
}

/**
 * This function creates memberships for a group. If the membership already exists, it will be updated to active.
 * @param groupId - The id of the group to create memberships for
 * @param data - An array of objects containing userId and admin
 * @param orderArg - The order to create the memberships in if undefined, the current order of the group will be used
 */
export async function createMembershipsForGroup(
    groupId: number,
    data: { userId: number, admin: boolean }[],
    orderArg?: number,
): Promise<void> {
    if (!await canEasilyManageMembershipOfGroup(groupId)) {
        throw new ServerError('BAD PARAMETERS', 'Denne Gruppetypen kan ikke enkelt opprette medlemskap')
    }
    const order = orderArg ?? await groupMethods.readCurrentGroupOrder({
        bypassAuth: true,
        params: {
            id: groupId,
        }
    })

    await prismaCall(() => prisma.membership.updateMany({
        where: {
            groupId,
            userId: {
                in: data.map(({ userId }) => userId),
            },
            order,
        },
        data: {
            active: true,
        },
    }))

    await prismaCall(() => prisma.membership.createMany({
        data: data.map(({ userId, admin }) => ({
            groupId,
            userId,
            admin,
            order,
            active: true,
        })),
        skipDuplicates: true,
    }))
    await invalidateManyUserSessionData(data.map(({ userId }) => userId))
}

/**
 * Create many memberships for a user. If the membership already exists, it will be updated to active.
 * @param userId - The id of the user to create memberships for
 * @param data - An array of objects containing groupId and admin representing the memberships to create
 * @param orderArg - The order to create the memberships in if undefined, the current order of the group will be used
 */
export async function createMembershipsForUser(
    userId: number,
    data: { groupId: number, admin: boolean }[],
    orderArg?: number,
): Promise<void> {
    if (!await canEasilyManageMembershipOfGroups(data.map(group => group.groupId))) {
        throw new ServerError('BAD PARAMETERS', 'Denne Gruppetypen kan ikke enkelt opprette medlemskap')
    }
    const ordersMap = await groupMethods.readCurrentGroupOrders({
        bypassAuth: true,
        params: {
            ids: data.map(group => group.groupId)
        }
    })

    const { order: fallbackOrder } = await readCurrentOmegaOrder()

    await prismaCall(() => prisma.membership.updateMany({
        where: {
            userId,
            groupId: {
                in: data.map(({ groupId }) => groupId),
            },
        },
        data: {
            active: true,
        },
    }))

    await prismaCall(() => prisma.membership.createMany({
        data: data.map(({ groupId, admin }) => ({
            groupId,
            userId,
            admin,
            order: orderArg ?? ordersMap.find(order => order.id === groupId)?.order ?? fallbackOrder,
            active: true,
        })),
        skipDuplicates: true,
    }))

    await invalidateOneUserSessionData(userId)
}
