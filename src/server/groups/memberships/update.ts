import 'server-only'
import { readCurrentGroupOrder } from '@/server/groups/read'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { ExpandedMembership } from './Types'

export async function updateMembership({
    groupId,
    userId,
    orderArg,
} : {
    groupId: number,
    userId: number,
    orderArg?: number | 'ACTIVE'
}, data: {
    admin?: boolean
    active?: boolean
}): Promise<ExpandedMembership> {
    const order = (orderArg && typeof orderArg === 'number') ? orderArg : await readCurrentGroupOrder(groupId)

    return await prismaCall(() => prisma.membership.update({
        where: {
            userId_groupId_order: {
                groupId,
                userId,
                order,
            },
        },
        data
    }))

}
