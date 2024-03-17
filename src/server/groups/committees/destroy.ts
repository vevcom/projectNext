import { createPrismaActionError } from '@/actions/error'
import prisma from '@/prisma'
import type { ExpandedCommittee } from './Types'
import type { ActionReturn } from '@/actions/Types'

export async function destroyCommittee(id: number): Promise<ActionReturn<ExpandedCommittee>> {
    try {
        const committee = await prisma.committee.delete({
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
        })

        return { success: true, data: committee }
    } catch (e) {
        return createPrismaActionError(e)
    }
}
