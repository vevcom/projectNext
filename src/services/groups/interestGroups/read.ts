import { prismaCall } from '@/services/prismaCall'
import prisma from '@/prisma'
import type { ExpandedInterestGroup } from './Types'

export async function readInterestGroups(): Promise<ExpandedInterestGroup[]> {
    return await prismaCall(() => prisma.interestGroup.findMany())
}

type ReadInterestGroupArgs = {
    id?: number,
    shortName?: string,
}

export async function readInterestGroup({ id, shortName }: ReadInterestGroupArgs): Promise<ExpandedInterestGroup> {
    return await prismaCall(() => prisma.interestGroup.findUniqueOrThrow({
        where: {
            id,
            shortName,
        }
    }))
}
