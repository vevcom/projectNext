import { prisma } from '@/prisma/client'
import { prismaCall } from '@/services/prismaCall'
import type { ExpandedCommittee } from './types'

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
