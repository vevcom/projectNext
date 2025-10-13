import { prismaCall } from '@/services/prismaCall'
import { prisma } from '@/prisma/client'

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
