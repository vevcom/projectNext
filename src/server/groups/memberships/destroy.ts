import 'server-only'
import { canEasalyManageMembershipOfGroup } from './canEasalyManageMembership'
import { prismaCall } from '@/server/prismaCall'
import { readCurrenOmegaOrder } from '@/server/omegaOrder/read'
import { ServerError } from '@/server/error'
import prisma from '@/prisma'
import type { ExpandedMembership } from './Types'

export async function destoryMembershipOfUser(
    groupId: number,
    userId: number,
    orderArg?: number
): Promise<ExpandedMembership> {
    if (!canEasalyManageMembershipOfGroup(groupId)) {
        throw new ServerError('BAD PARAMETERS', 'Denne Gruppetypen kan ikke enkelt opprette medlemskap')
    }
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

export async function destroyMembershipOfUsers(
    groupId: number,
    userIds: number[],
    orderArg?: number,
): Promise<void> {
    if (!canEasalyManageMembershipOfGroup(groupId)) {
        throw new ServerError('BAD PARAMETERS', 'Denne Gruppetypen kan ikke enkelt opprette medlemskap')
    }
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
