import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { ExpandedManualGroup } from './Types'

export async function destroyManualGroup(id: number): Promise<ExpandedManualGroup> {
    return await prismaCall(() => prisma.manualGroup.delete({
        where: {
            id,
        },
    }))
}
