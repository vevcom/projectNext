import 'server-only'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { ExpandedMembership } from './Types'
import { readCurrentGroupOrder } from '../read'

export async function updateMembership(
    groupId: number,
    userId: number,
    admin: boolean,
    orderArg?: number
): Promise<ExpandedMembership> {
    const order = orderArg ?? await readCurrentGroupOrder(groupId)

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
