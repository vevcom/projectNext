import prisma from '@/prisma'
import { prismaCall } from '@/server/prismaCall'
import { ServerError } from '@/server/error'
import { articleRealtionsIncluder } from '@/server/cms/articles/ConfigVars'
import type { ExpandedCommittee, ExpandedCommitteeWithArticle } from './Types'

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

export async function readCommittee(where: ReadCommitteeArgs): Promise<ExpandedCommitteeWithArticle> {
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
            committeeArticle: {
                include: articleRealtionsIncluder
            }
        },
    }))
}
