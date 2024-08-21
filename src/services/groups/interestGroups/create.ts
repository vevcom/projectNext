import { prismaCall } from '@/services/prismaCall'
import prisma from '@/prisma'
import type { ExpandedInterestGroup } from './Types'

type CreateInterestGroupArgs = {
    name: string,
    shortName: string,
}

export async function createInterestGroup({ name, shortName }: CreateInterestGroupArgs): Promise<ExpandedInterestGroup> {
    return await prismaCall(() => prisma.interestGroup.create({
        data: {
            name,
            shortName,
            group: {
                create: {
                    groupType: 'INTEREST_GROUP',
                    membershipRenewal: false,
                }
            }
        }
    }))
}
