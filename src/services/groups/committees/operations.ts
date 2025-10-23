import { committeeAuth } from './auth'
import { committeeExpandedIncluder, committeeLogoIncluder, membershipIncluder } from './constants'
import { ServerOnlyAuther } from '@/auth/auther/RequireServer'
import { cmsImageOperations } from '@/cms/images/operations'
import { cmsParagraphOperations } from '@/cms/paragraphs/operations'
import { imageOperations } from '@/services/images/operations'
import { defineOperation } from '@/services/serviceOperation'
import { z } from 'zod'
import { articleRealtionsIncluder } from '@/cms/articles/constants'
import { implementUpdateArticleOperations } from '@/cms/articles/implement'


const readAll = defineOperation({
    authorizer: () => committeeAuth.readAll.dynamicFields({}),
    operation: async ({ prisma }) => prisma.committee.findMany({
        include: committeeLogoIncluder,
    })
})

const read = defineOperation({
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
})

const readFromGroupIds = defineOperation({
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
})

const readMembers = defineOperation({
    authorizer: () => committeeAuth.readMembers.dynamicFields({}),
    paramsSchema: z.object({
        shortName: z.string(),
        active: z.boolean().optional(),
    }),
    operation: async ({ prisma, params }) => {
        const defaultImage = await imageOperations.readSpecial({
            params: { special: 'DEFAULT_PROFILE_IMAGE' },
        })

        const commitee = await prisma.committee.findUniqueOrThrow({
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

        return commitee.group.memberships.map(member => ({
            ...member,
            user: {
                ...member.user,
                image: member.user.image ?? defaultImage
            }
        }))
    }
})

const readArticle = defineOperation({
    authorizer: () => committeeAuth.readArticle.dynamicFields({}),
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
})

const readParagraph = defineOperation({
    authorizer: () => committeeAuth.readParagraph.dynamicFields({}),
    paramsSchema: z.object({
        shortName: z.string(),
    }),
    operation: async ({ prisma, params }) => (await prisma.committee.findUniqueOrThrow({
        where: params,
        select: {
            paragraph: true,
        }
    })).paragraph
})

const updateParagraphContent = cmsParagraphOperations.updateContent.implement({
    implementationParamsSchema: z.object({
        shortName: z.string(),
    }),
    authorizer: async ({ implementationParams }) =>
        committeeAuth.updateParagraphContent.dynamicFields({
            groupId: (await read({
                params: { shortName: implementationParams.shortName },
                bypassAuth: true
            })).groupId
        }),
    ownershipCheck: async ({ implementationParams, params }) =>
        (await readParagraph({
            params: { shortName: implementationParams.shortName },
            bypassAuth: true
        })).id === params.paragraphId
})

const updateLogo = cmsImageOperations.update.implement({
    implementationParamsSchema: z.object({
        shortName: z.string(),
    }),
    authorizer: async ({ implementationParams }) =>
        committeeAuth.updateLogo.dynamicFields({
            groupId: (await read({
                params: { shortName: implementationParams.shortName },
                bypassAuth: true
            })).groupId
        }),
    ownershipCheck: async ({ implementationParams, params }) => {
        const committee = await read({
            params: { shortName: implementationParams.shortName },
            bypassAuth: true
        })
        return committee.logoImage.id === params.cmsImageId
    }
})

export const committeeOperations = {
    readAll,
    read,
    readFromGroupIds,
    readMembers,
    readArticle,
    readParagraph,
    updateParagraphContent,
    updateLogo,
    updateArticle: implementUpdateArticleOperations({
        authorizer: async ({ implementationParams }) => committeeAuth.updateArticle.dynamicFields({
            groupId: (await read({
                params: { shortName: implementationParams.shortName },
                bypassAuth: true
            })).groupId
        }),
        implementationParamsSchema: z.object({
            shortName: z.string(),
        }),
        ownedArticles: async ({ implementationParams }) => {
            const article = await readArticle({ params: { shortName: implementationParams.shortName }, bypassAuth: true })
            return [article]
        }
    })
}
