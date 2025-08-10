import prisma from '@/prisma'
import { prismaCall } from '@/services/prismaCall'
import { ServerError } from '@/services/error'
import { articleRealtionsIncluder } from '@/services/cms/articles/ConfigVars'
import type { ExpandedArticle } from '@/services/cms/articles/Types'
import type { CmsParagraph } from '@prisma/client'
import type { ExpandedCommittee, ExpandedCommitteeWithCover } from './Types'
import { UserConfig } from '@/services/users/config'
import { ImageMethods } from '@/services/images/methods'

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

export async function readCommitteesFromIds(ids: number[]) {
    return await prismaCall(() => prisma.committee.findMany({
        where: {
            id: {
                in: ids
            }
        }
    }))
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

// TODO: Create ServiceMethod
export async function readCommitteeMembers(shortName: string) {
    const defaultImage = await ImageMethods.readSpecial.client(prisma).execute({
        params: { special: 'DEFAULT_PROFILE_IMAGE' },
        session: null,
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
                                    ...UserConfig.filterSelection,
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
