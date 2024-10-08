import prisma from '@/prisma'
import { prismaCall } from '@/services/prismaCall'
import { ServerError } from '@/services/error'
import type { ExpandedCommittee } from './Types'

export async function readCommittees(): Promise<ExpandedCommittee[]> {
    return await prismaCall(() => prisma.committee.findMany({
        include: {
            logoImage: {
                include: {
                    image: true,
                },
            },
        },
    })
    )
}

type ReadCommitteeArgs = {
    id?: number,
    shortName?: string,
}

export async function readCommittee(where: ReadCommitteeArgs): Promise<ExpandedCommittee> {
    if (!where) throw new ServerError('BAD PARAMETERS', 'Navn eller id må være spesifisert for å finne en komité.')

    return await prismaCall(() => prisma.committee.findUniqueOrThrow({
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
    }))
}

export async function readCommitteesFromIds(ids: number[]) {
    return await prismaCall(() => prisma.committee.findMany({
        where: {
            id: {
                in: ids
            }
        }
    }))
}
