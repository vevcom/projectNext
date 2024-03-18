import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { ExpandedManualGroup } from './Types'

export async function readManualGroups(): Promise<ExpandedManualGroup[]> {
    return await prismaCall(() => prisma.manualGroup.findMany())
}

export async function readManualGroup(id: number): Promise<ExpandedManualGroup> {
    return await prismaCall(() => prisma.manualGroup.findUniqueOrThrow({
        where: {
            id,
        },
    }))
}
