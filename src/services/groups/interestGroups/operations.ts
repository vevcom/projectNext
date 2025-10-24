import '@pn-server-only'
import { interestGroupAuth } from './auth'
import { interestGroupSchemas } from './schemas'
import { readCurrentOmegaOrder } from '@/services/omegaOrder/read'
import { articleSectionsRealtionsIncluder } from '@/services/cms/articleSections/constants'
import { defineOperation } from '@/services/serviceOperation'
import { cmsParagraphOperations } from '@/cms/paragraphs/operations'
import { implementUpdateArticleSectionOperations } from '@/cms/articleSections/implement'
import { z } from 'zod'

export const interestGroupOperations = {
    create: defineOperation({
        dataSchema: interestGroupSchemas.create,
        authorizer: () => interestGroupAuth.create.dynamicFields({}),
        operation: async ({ prisma, data }) => {
            const { order } = await readCurrentOmegaOrder()

            await prisma.interestGroup.create({
                data: {
                    ...data,
                    articleSection: {
                        create: {
                            cmsImage: {},
                            cmsParagraph: {},
                            cmsLink: {},
                        }
                    },
                    group: {
                        create: {
                            groupType: 'INTEREST_GROUP',
                            order,
                        }
                    }
                }
            })
        }
    }),

    readMany: defineOperation({
        authorizer: () => interestGroupAuth.readMany.dynamicFields({}),
        operation: ({ prisma }) => prisma.interestGroup.findMany({
            include: {
                articleSection: {
                    include: articleSectionsRealtionsIncluder,
                },
            },
            orderBy: [
                { name: 'asc' },
                { id: 'asc' },
            ]
        })
    }),

    read: defineOperation({
        paramsSchema: z.object({
            id: z.number().optional(),
            shortName: z.string().optional(),
        }),
        authorizer: () => interestGroupAuth.read.dynamicFields({}),
        operation: async ({ prisma, params: { id, shortName } }) => await prisma.interestGroup.findUniqueOrThrow({
            where: {
                id,
                shortName,
            },
            include: {
                articleSection: {
                    include: articleSectionsRealtionsIncluder,
                },
            }
        })
    }),

    update: defineOperation({
        paramsSchema: z.object({
            id: z.number(),
        }),
        dataSchema: interestGroupSchemas.update,
        authorizer: async ({ prisma, params }) => {
            const { groupId } = await prisma.interestGroup.findUniqueOrThrow({
                where: { id: params.id },
                select: { groupId: true },
            })

            return interestGroupAuth.update.dynamicFields({
                groupId,
            })
        },
        operation: async ({ prisma, params: { id }, data }) => prisma.interestGroup.update({
            where: { id },
            data,
        }),
    }),

    destroy: defineOperation({
        paramsSchema: z.object({
            id: z.number(),
        }),
        authorizer: () => interestGroupAuth.destroy.dynamicFields({}),
        opensTransaction: true,
        operation: async ({ prisma, params: { id } }) => {
            await prisma.$transaction(async tx => {
                const intrestGroup = await tx.interestGroup.delete({
                    where: { id }
                })
                await tx.group.delete({
                    where: { id: intrestGroup.groupId }
                })
            })
        }
    }),

    readSpecialCmsParagraphGeneralInfo: cmsParagraphOperations.readSpecial.implement({
        authorizer: () => interestGroupAuth.readSpecialCmsParagraphGeneralInfo.dynamicFields({}),
        ownershipCheck: ({ params }) => params.special === 'INTEREST_GROUP_GENERAL_INFO'
    }),

    updateSpecialCmsParagraphContentGeneralInfo: cmsParagraphOperations.updateContent.implement({
        authorizer: () => interestGroupAuth.updateSpecialCmsParagraphContentGeneralInfo.dynamicFields({}),
        ownershipCheck: async ({ params }) =>
            await cmsParagraphOperations.isSpecial({
                params: {
                    paragraphId: params.paragraphId,
                    special: ['INTEREST_GROUP_GENERAL_INFO']
                }
            })
    }),
    updateArticleSection: implementUpdateArticleSectionOperations({
        implementationParamsSchema: z.object({
            interestGroupId: z.number()
        }),
        authorizer: async ({ implementationParams, prisma }) => {
            const { groupId } = await prisma.interestGroup.findUniqueOrThrow({
                where: { id: implementationParams.interestGroupId },
                select: { groupId: true }
            })
            return interestGroupAuth.updateArticleSection.dynamicFields({
                groupId
            })
        },
        ownedArticleSections: ({ prisma, implementationParams }) =>
            prisma.interestGroup.findUniqueOrThrow({
                where: { id: implementationParams.interestGroupId },
                include: {
                    articleSection: {
                        include: {
                            cmsImage: true,
                            cmsParagraph: true,
                            cmsLink: true
                        }
                    }
                }
            }).then(articleGroup => [articleGroup.articleSection]),
        destroyOnEmpty: false,
    }),
}
