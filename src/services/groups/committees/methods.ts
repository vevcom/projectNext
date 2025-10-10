import { committeeAuthers } from './authers'
import { committeeExpandedIncluder, committeeLogoIncluder, membershipIncluder } from './config'
import { ServerOnlyAuther } from '@/auth/auther/RequireServer'
import { serviceMethod } from '@/services/serviceMethod'
import { articleRealtionsIncluder } from '@/cms/articles/ConfigVars'
import { imageMethods } from '@/services/images/methods'
import { z } from 'zod'

export const committeeMethods = {

    readCommittees: serviceMethod({
        authorizer: () => committeeAuthers.read.dynamicFields({}),
        method: async ({ prisma }) => prisma.committee.findMany({
            include: committeeLogoIncluder,
        })
    }),

    readCommittee: serviceMethod({
        authorizer: () => committeeAuthers.read.dynamicFields({}),
        paramsSchema: z.union([
            z.object({ id: z.number() }),
            z.object({ shortName: z.string() })
        ]),
        method: async ({ prisma, params }) => {
            const defaultImage = await imageMethods.readSpecial({
                params: { special: 'DEFAULT_PROFILE_IMAGE' },
                bypassAuth: true
            })

            const result = await prisma.committee.findUniqueOrThrow({
                where: params,
                include: committeeExpandedIncluder,
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
    }),

    readCommitteArticle: serviceMethod({
        authorizer: () => committeeAuthers.read.dynamicFields({}),
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
    }),

    readCommitteesFromGroupIds: serviceMethod({
        authorizer: ServerOnlyAuther,
        paramsSchema: z.object({
            ids: z.number().int().array()
        }),
        method: async ({ prisma, params }) => await prisma.committee.findMany({
            where: {
                groupId: {
                    in: params.ids
                }
            },
            include: committeeLogoIncluder,
        })
    }),

    readCommitteeParagraph: serviceMethod({
        authorizer: () => committeeAuthers.read.dynamicFields({}),
        paramsSchema: z.object({
            shortName: z.string(),
        }),
        method: async ({ prisma, params }) => (await prisma.committee.findUniqueOrThrow({
            where: params,
            select: {
                paragraph: true,
            }
        })).paragraph
    }),

    readCommitteeMembers: serviceMethod({
        authorizer: () => committeeAuthers.read.dynamicFields({}),
        paramsSchema: z.object({
            shortName: z.string(),
            active: z.boolean().optional(),
        }),
        method: async ({ prisma, params }) => {
            const defaultImage = await imageMethods.readSpecial({
                params: { special: 'DEFAULT_PROFILE_IMAGE' },
            })


            const com = await prisma.committee.findUniqueOrThrow({
                where: {
                    shortName: params.shortName
                },
                select: {
                    group: {
                        select: {
                            memberships: {
                                include: membershipIncluder,
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
    }),
}
