import { prismaCall } from '@/services/prismaCall'
import { prisma } from '@/prisma-pn-client-instance'
import { omegaOrderOperations } from '@/services/omegaOrder/operations'
import type { ExpandedManualGroup } from './types'

type CreateManualGroupArgs = {
    name: string,
    shortName: string,
}

export async function createManualGroup(data: CreateManualGroupArgs): Promise<ExpandedManualGroup> {
    const order = (await omegaOrderOperations.readCurrent({ bypassAuth: true })).order

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
