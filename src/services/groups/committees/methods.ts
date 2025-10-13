import { CommitteeAuthers } from './authers'
import { CommitteeConfig } from './config'
import { ServerOnlyAuther } from '@/auth/auther/RequireServer'
import { ImageMethods } from '@/services/images/methods'
import { ServiceMethod } from '@/services/ServiceMethod'
import { articleRealtionsIncluder } from '@/cms/articles/ConfigVars'
import { z } from 'zod'

export namespace CommitteeMethods {

    export const readCommittees = ServiceMethod({
        auther: () => CommitteeAuthers.read.dynamicFields({}),
        method: async ({ prisma }) => prisma.committee.findMany({
            include: CommitteeConfig.committeeLogoIncluder,
        })
    })

    export const readCommittee = ServiceMethod({
        auther: () => CommitteeAuthers.read.dynamicFields({}),
        paramsSchema: z.union([
            z.object({ id: z.number() }),
            z.object({ shortName: z.string() })
        ]),
        method: async ({ prisma, params }) => {
            const defaultImage = await ImageMethods.readSpecial.client(prisma).execute({
                params: { special: 'DEFAULT_PROFILE_IMAGE' },
                session: null,
                bypassAuth: true
            })

            const result = await prisma.committee.findUniqueOrThrow({
                where: params,
                include: CommitteeConfig.committeeExpandedIncluder
            })

            return {
                ...result,
                coverImage: result.committeeArticle.coverImage,
                group: {
                    ...result.group,
                    memberships: result.group.memberships.map(membership => ({
                        ...membership,
                        user: {
                            ...membership.user,
                            image: membership.user.image ?? defaultImage
                        }
                    }))
                }
            }
        }
    })

    export const readCommitteArticle = ServiceMethod({
        auther: () => CommitteeAuthers.read.dynamicFields({}),
        paramsSchema: z.object({
            shortName: z.string(),
        }),
        method: async ({ prisma, params }) => (await prisma.committee.findUniqueOrThrow({
            where: params,
            select: {
                committeeArticle: {
                    include: articleRealtionsIncluder,
                }
            }
        })).committeeArticle
    })

    export const readCommitteesFromGroupIds = ServiceMethod({
        auther: ServerOnlyAuther,
        paramsSchema: z.object({
            ids: z.number().int().array()
        }),
        method: async ({ prisma, params }) => await prisma.committee.findMany({
            where: {
                groupId: {
                    in: params.ids
                }
            },
            include: CommitteeConfig.committeeLogoIncluder,
        })
    })

    export const readCommitteeParagraph = ServiceMethod({
        auther: () => CommitteeAuthers.read.dynamicFields({}),
        paramsSchema: z.object({
            shortName: z.string(),
        }),
        method: async ({ prisma, params }) => (await prisma.committee.findUniqueOrThrow({
            where: params,
            select: {
                paragraph: true,
            }
        })).paragraph
    })

    export const readCommitteeMembers = ServiceMethod({
        auther: () => CommitteeAuthers.read.dynamicFields({}),
        paramsSchema: z.object({
            shortName: z.string(),
            active: z.boolean().optional(),
        }),
        method: async ({ prisma, session, params }) => {
            const defaultImage = await ImageMethods.readSpecial.client(prisma).execute({
                params: { special: 'DEFAULT_PROFILE_IMAGE' },
                session,
            })


            const com = await prisma.committee.findUniqueOrThrow({
                where: {
                    shortName: params.shortName
                },
                select: {
                    group: {
                        select: {
                            memberships: {
                                include: CommitteeConfig.membershipIncluder,
                                where: {
                                    active: params.active
                                }
                            }
                        }
                    }
                }
            })


            return com.group.memberships.map(member => ({
                ...member,
                user: {
                    ...member.user,
                    image: member.user.image ?? defaultImage
                }
            }))
        }
    })
}
