import '@pn-server-only'
import { prismaCall } from '@/services/prismaCall'
import { prisma } from '@/prisma/client'
import { invalidateOneUserSessionData } from '@/services/auth/invalidateSession'
import { groupOperations } from '@/services/groups/operations'
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
        await groupOperations.readCurrentGroupOrder({
            bypassAuth: true,
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
