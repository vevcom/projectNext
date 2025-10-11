import { committeeAuth } from './auth'
import { committeeExpandedIncluder, committeeLogoIncluder, membershipIncluder } from './constants'
import { ServerOnlyAuther } from '@/auth/auther/RequireServer'
import { articleRealtionsIncluder } from '@/cms/articles/ConfigVars'
import { imageOperations } from '@/services/images/operations'
import { defineOperation } from '@/services/serviceOperation'
import { z } from 'zod'

export const committeeOperations = {

    readCommittees: defineOperation({
        authorizer: () => committeeAuth.read.dynamicFields({}),
        operation: async ({ prisma }) => prisma.committee.findMany({
            include: committeeLogoIncluder,
        })
    }),

    readCommittee: defineOperation({
        authorizer: () => committeeAuth.read.dynamicFields({}),
        paramsSchema: z.union([
            z.object({ id: z.number() }),
            z.object({ shortName: z.string() })
        ]),
        operation: async ({ prisma, params }) => {
            const defaultImage = await imageOperations.readSpecial({
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

    readCommitteArticle: defineOperation({
        authorizer: () => committeeAuth.read.dynamicFields({}),
        paramsSchema: z.object({
            shortName: z.string(),
        }),
        operation: async ({ prisma, params }) => (await prisma.committee.findUniqueOrThrow({
            where: params,
            select: {
                committeeArticle: {
                    include: articleRealtionsIncluder,
                }
            }
        })).committeeArticle
    }),

    readCommitteesFromGroupIds: defineOperation({
        authorizer: ServerOnlyAuther,
        paramsSchema: z.object({
            ids: z.number().int().array()
        }),
        operation: async ({ prisma, params }) => await prisma.committee.findMany({
            where: {
                groupId: {
                    in: params.ids
                }
            },
            include: committeeLogoIncluder,
        })
    }),

    readCommitteeParagraph: defineOperation({
        authorizer: () => committeeAuth.read.dynamicFields({}),
        paramsSchema: z.object({
            shortName: z.string(),
        }),
        operation: async ({ prisma, params }) => (await prisma.committee.findUniqueOrThrow({
            where: params,
            select: {
                paragraph: true,
            }
        })).paragraph
    }),

    readCommitteeMembers: defineOperation({
        authorizer: () => committeeAuth.read.dynamicFields({}),
        paramsSchema: z.object({
            shortName: z.string(),
            active: z.boolean().optional(),
        }),
        operation: async ({ prisma, params }) => {
            const defaultImage = await imageOperations.readSpecial({
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
