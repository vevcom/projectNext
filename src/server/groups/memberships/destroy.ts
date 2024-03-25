import 'server-only'
import { prismaCall } from '@/server/prismaCall'
import type { ExpandedMembership } from './Types'
import { readCurrenOmegaOrder } from '@/server/omegaOrder/read'

export async function destoryMembershipOfUser(
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

export async function destroyMembershipOfUsers(
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