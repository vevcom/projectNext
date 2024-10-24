import prisma from '@/prisma'
import { prismaCall } from '@/services/prismaCall'
import { ServerError } from '@/services/error'
import { articleRealtionsIncluder } from '@/services/cms/articles/ConfigVars'
import type { ExpandedArticle } from '@/services/cms/articles/Types'
import type { CmsParagraph } from '@prisma/client'
import type { ExpandedCommittee, ExpandedCommitteeWithCover } from './Types'
import { Articles } from '@/services/cms/articles'

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

export async function readCommittee(where: ReadCommitteeArgs): Promise<ExpandedCommitteeWithCover> {
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
                include: {
                    coverImage: {
                        include: {
                            image: true,
                        },
                    }
                }
            }
        },
    })).then(commitee => ({
        ...commitee,
        coverImage: commitee.committeeArticle.coverImage,
    }))
}

export async function readCommitteeArticle(shortName: string) : Promise<ExpandedArticle<true>> {
    const committee = await prismaCall(() => prisma.committee.findUniqueOrThrow({
        where: { shortName },
        select: {
            committeeArticle: {
                include: articleRealtionsIncluder
            }
        }
    }))
    return Articles.validateAndCollapseCmsLinksInArticle.client(prisma).execute({
        params: committee.committeeArticle, session: null,
    })
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

export async function readCommitteeParagraph(shortName: string) : Promise<CmsParagraph> {
    const article = await prismaCall(() => prisma.committee.findUniqueOrThrow({
        where: { shortName },
        select: {
            paragraph: true
        }
    }))
    return article.paragraph
}
