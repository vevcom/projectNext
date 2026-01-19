import { prismaCall } from '@/services/prismaCall'
import { prisma } from '@/prisma-pn-client-instance'
import type { ExpandedManualGroup } from './types'

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
