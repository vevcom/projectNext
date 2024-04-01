import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { ExpandedInterestGroup } from './Types'

type CreateInterestGroupArgs = {
    name: string,
    shortName: string,
}

export async function updateInterestGroup(id: number, data: CreateInterestGroupArgs): Promise<ExpandedInterestGroup> {
    return await prismaCall(() => prisma.interestGroup.update({
        where: {
            id,
        },
        data,
    }))
}
