import { createActionError, createPrismaActionError } from '@/actions/error'
import prisma from '@/prisma'
import type { ExpandedCommittee } from './Types'
import type { ActionReturn } from '@/actions/Types'

export async function readCommittees(): Promise<ActionReturn<ExpandedCommittee[]>> {
    try {
        const committees = await prisma.committee.findMany({
            include: {
                logoImage: {
                    include: {
                        image: true,
                    },
                },
            },
        })

        return { success: true, data: committees }
    } catch (e) {
        return createPrismaActionError(e)
    }
}

type ReadCommitteeArgs = {
    id?: number,
    shortName?: string,
}

export async function readCommittee(where: ReadCommitteeArgs): Promise<ActionReturn<ExpandedCommittee>> {
    if (!where) return createActionError('BAD PARAMETERS', 'Navn eller id må være spesifisert for å finne en komité.')

    try {
        const committee = await prisma.committee.findUniqueOrThrow({
            where: {
                id: where.id,
                shortName: where.shortName,
            },
            include: {
                logoImage: {
                    include: {
                        image: true,
                    },
                },
            },
        })

        return { success: true, data: committee }
    } catch (e) {
        return createPrismaActionError(e)
    }
}
