import { prisma } from '@/prisma/client'
import { prismaCall } from '@/services/prismaCall'
import { ServerError } from '@/services/error'
import { articleRealtionsIncluder } from '@/services/cms/articles/ConfigVars'
import { imageOperations } from '@/services/images/operations'
import { userFilterSelection } from '@/services/users/constants'
import type { ExpandedArticle } from '@/services/cms/articles/Types'
import type { CmsParagraph } from '@prisma/client'
import type { ExpandedCommittee, ExpandedCommitteeWithCover } from './Types'

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

export async function readCommitteeArticle(shortName: string) : Promise<ExpandedArticle> {
    const article = await prismaCall(() => prisma.committee.findUniqueOrThrow({
        where: { shortName },
        select: {
            committeeArticle: {
                include: articleRealtionsIncluder
            }
        }
    }))
    return article.committeeArticle
}

export async function readCommitteesFromGroupIds(ids: number[]) {
    return await prismaCall(() => prisma.committee.findMany({
        where: {
            groupId: {
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

// TODO: Create ServiceOperation
export async function readCommitteeMembers(shortName: string) {
    const defaultImage = await imageOperations.readSpecial({
        params: { special: 'DEFAULT_PROFILE_IMAGE' },
        bypassAuth: true
    })

    const com = await prismaCall(() => prisma.committee.findUniqueOrThrow({
        where: { shortName },
        select: {
            group: {
                select: {
                    memberships: {
                        include: {
                            user: {
                                select: {
                                    ...userFilterSelection,
                                    image: true
                                }
                            }
                        }
                    }
                }
            }
        }
    }))
    return com.group.memberships.map(member => ({
        ...member,
        user: {
            ...member.user,
            image: member.user.image ?? defaultImage
        }
    }))
}
