import { createPrismaActionError } from '@/actions/error'
import prisma from '@/prisma'
import type { ExpandedCommittee } from './Types'
import type { ActionReturn } from '@/actions/Types'

export async function readCommittees(): Promise<ActionReturn<ExpandedCommittee[]>> {
    try {
        const committees = await prisma.committee.findMany()

        return { success: true, data: committees }
    } catch (e) {
        return createPrismaActionError(e)
    }
}

export async function readCommittee(id: number): Promise<ActionReturn<ExpandedCommittee>> {
    try {
        const committee = await prisma.committee.findUniqueOrThrow({
            where: {
                id,
            },
        })

        return { success: true, data: committee }
    } catch (e) {
        return createPrismaActionError(e)
    }
}
