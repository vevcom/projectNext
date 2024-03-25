import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import { readCurrenOmegaOrder } from '@/server/omegaOrder/read'
import type { ExpandedManualGroup } from './Types'

type CreateManualGroupArgs = {
    name: string,
    shortName: string,
    membershipRenewal: boolean,
}

export async function createManualGroup(data: CreateManualGroupArgs): Promise<ExpandedManualGroup> {
    const order = (await readCurrenOmegaOrder()).order

    return await prismaCall(() => prisma.manualGroup.create({
        data: {
            ...data,
            group: {
                create: {
                    groupType: 'MANUAL_GROUP',
                    membershipRenewal: data.membershipRenewal,
                    order,
                }
            }
        },
    }))
}
