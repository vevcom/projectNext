import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'

type UpdateManualGroupArgs = {
    name?: string,
    shortName?: string,
}

export async function updateManualGroup(id: number, data: UpdateManualGroupArgs) {
    return await prismaCall(() => prisma.manualGroup.update({
        where: {
            id,
        },
        data
    }))
}
