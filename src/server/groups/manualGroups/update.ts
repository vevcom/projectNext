import { prismaCall } from "@/server/prismaCall"

type UpdateManualGroupArgs = {
    name?: string,
    shortName?: string,
    membershipRenewal?: boolean,
}

export async function updateManualGroup(id: number, data: UpdateManualGroupArgs) {
    return await prismaCall(() => prisma.manualGroup.update({
        where: {
            id,
        },
        data: {
            ...data,
            group: {
                update: {
                    membershipRenewal: data.membershipRenewal,
                },
            },
        },
    }))
}