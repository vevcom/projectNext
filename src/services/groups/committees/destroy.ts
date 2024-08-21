import prisma from '@/prisma'
import { prismaCall } from '@/server/prismaCall'
import type { ExpandedCommittee } from './Types'

export async function destroyCommittee(id: number): Promise<ExpandedCommittee> {
    return await prismaCall(() => prisma.committee.delete({
        where: {
            id,
        },
        include: {
            logoImage: {
                include: {
                    image: true
                }
            }
        }
    }))
}
