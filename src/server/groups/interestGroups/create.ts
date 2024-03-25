import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import { readCurrenOmegaOrder } from '@/server/omegaOrder/read'
import type { ExpandedInterestGroup } from './Types'

type CreateInterestGroupArgs = {
    name: string,
    shortName: string,
}

export async function createInterestGroup({ name, shortName }: CreateInterestGroupArgs): Promise<ExpandedInterestGroup> {
    const order = (await readCurrenOmegaOrder()).order

    return await prismaCall(() => prisma.interestGroup.create({
        data: {
            name,
            shortName,
            group: {
                create: {
                    groupType: 'INTEREST_GROUP',
                    membershipRenewal: false,
                    order,
                }
            }
        }
    }))
}
