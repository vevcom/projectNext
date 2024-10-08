import { prismaCall } from '@/services/prismaCall'
import prisma from '@/prisma'
import { readCurrentOmegaOrder } from '@/services/omegaOrder/read'
import type { ExpandedManualGroup } from './Types'

type CreateManualGroupArgs = {
    name: string,
    shortName: string,
}

export async function createManualGroup(data: CreateManualGroupArgs): Promise<ExpandedManualGroup> {
    const order = (await readCurrentOmegaOrder()).order

    return await prismaCall(() => prisma.manualGroup.create({
        data: {
            ...data,
            group: {
                create: {
                    groupType: 'MANUAL_GROUP',
                    order,
                }
            }
        },
    }))
}
