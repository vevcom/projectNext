import { prismaCall } from "@/server/prismaCall"
import { ExpandedManualGroup } from "./Types"

type CreateManualGroupArgs = {
    name: string,
    shortName: string,
    membershipRenewal: boolean,
}

export async function createManualGroup(data: CreateManualGroupArgs): Promise<ExpandedManualGroup> {
    return await prismaCall(() => prisma.manualGroup.create({
        data: {
            ...data,
            group: {
                create: {
                    groupType: 'MANUAL_GROUP',
                    membershipRenewal: data.membershipRenewal,
                }
            }
        },
    }))
}