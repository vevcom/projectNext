import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { ExpandedInterestGroup } from './Types'

export async function destroyInterestGroup(id: number): Promise<ExpandedInterestGroup> {
    return await prismaCall(() => prisma.interestGroup.delete({
        where: {
            id,
        },
    }))
}
