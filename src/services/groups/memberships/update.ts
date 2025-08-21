import '@pn-server-only'
import { prismaCall } from '@/services/prismaCall'
import prisma from '@/prisma'
import { invalidateOneUserSessionData } from '@/services/auth/invalidateSession'
import { GroupMethods } from '@/services/groups/methods'
import type { ExpandedMembership } from './Types'

export async function updateMembership({
    groupId,
    userId,
    orderArg,
}: {
    groupId: number,
    userId: number,
    orderArg?: number | 'ACTIVE'
}, data: {
    admin?: boolean
    active?: boolean
}): Promise<ExpandedMembership> {
    const order = (orderArg && typeof orderArg === 'number') ? orderArg : (
        await GroupMethods.readCurrentGroupOrder.newClient().execute({
            bypassAuth: true,
            session: null,
            params: {
                id: groupId
            }
        })
    )

    const membership = await prismaCall(() => prisma.membership.update({
        where: {
            userId_groupId_order: {
                groupId,
                userId,
                order,
            },
        },
        data
    }))
    invalidateOneUserSessionData(userId)
    return membership
}
