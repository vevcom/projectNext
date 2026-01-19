import { prismaCall } from '@/services/prismaCall'
import { prisma } from '@/prisma-pn-client-instance'
import type { ExpandedManualGroup } from './types'

export async function destroyManualGroup(id: number): Promise<ExpandedManualGroup> {
    return await prismaCall(() => prisma.manualGroup.delete({
        where: {
            id,
        },
    }))
}
