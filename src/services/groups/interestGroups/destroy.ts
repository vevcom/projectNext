import { prismaCall } from '@/services/prismaCall'
import prisma from '@/prisma'

export async function destroyInterestGroup(id: number): Promise<void> {
    await prismaCall(() => prisma.interestGroup.delete({
        where: {
            id,
        },
    }))
}
