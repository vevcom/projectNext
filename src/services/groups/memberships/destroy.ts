import '@pn-server-only'
import { canEasilyManageMembershipOfGroup } from './canEasilyManageMembership'
import { readCurrentGroupOrder } from '@/services/groups/read'
import { prismaCall } from '@/services/prismaCall'
import { ServerError } from '@/services/error'
import prisma from '@/prisma'
import { invalidateManyUserSessionData, invalidateOneUserSessionData } from '@/services/auth/invalidateSession'
import type { ExpandedMembership } from './Types'

export async function destoryMembershipOfUser({
    groupId,
    userId,
    orderArg,
}: {
    groupId: number,
    userId: number,
    orderArg?: number
}): Promise<ExpandedMembership> {
    if (!await canEasilyManageMembershipOfGroup(groupId)) {
        throw new ServerError('BAD PARAMETERS', 'Denne Gruppetypen kan ikke enkelt opprette medlemskap')
    }
    const order = orderArg ?? await readCurrentGroupOrder(groupId)

    const membership = await prismaCall(() => prisma.membership.delete({
        where: {
            userId_groupId_order: {
                groupId,
                userId,
                order,
            }
        },
    }))
    await invalidateOneUserSessionData(userId)
    return membership
}

export async function destroyMembershipOfUsers(
    groupId: number,
    userIds: number[],
    orderArg?: number,
): Promise<void> {
    if (!await canEasilyManageMembershipOfGroup(groupId)) {
        throw new ServerError('BAD PARAMETERS', 'Denne Gruppetypen kan ikke enkelt opprette medlemskap')
    }
    const order = orderArg ?? await readCurrentGroupOrder(groupId)

    await prismaCall(() => prisma.membership.deleteMany({
        where: {
            groupId,
            userId: {
                in: userIds,
            },
            order,
        },
    }))
    invalidateManyUserSessionData(userIds)
}
