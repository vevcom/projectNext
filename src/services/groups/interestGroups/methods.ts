import '@pn-server-only'
import { interestGroupAuthers } from './authers'
import { interestGroupSchemas } from './schemas'
import { readCurrentOmegaOrder } from '@/services/omegaOrder/read'
import { serviceMethod } from '@/services/serviceMethod'
import { articleSectionsRealtionsIncluder } from '@/services/cms/articleSections/ConfigVars'
import { z } from 'zod'
import type { ExpandedInterestGroup } from './Types'

export const interestGroupMethods = {
    create: serviceMethod({
        dataSchema: interestGroupSchemas.create,
        authorizer: () => interestGroupAuthers.create.dynamicFields({}),
        method: async ({ prisma, data }) => {
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

    readMany: serviceMethod({
        authorizer: () => interestGroupAuthers.readMany.dynamicFields({}),
        method: async ({ prisma }): Promise<ExpandedInterestGroup[]> => prisma.interestGroup.findMany({
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

    read: serviceMethod({
        paramsSchema: z.object({
            id: z.number().optional(),
            shortName: z.string().optional(),
        }),
        authorizer: () => interestGroupAuthers.read.dynamicFields({}),
        method: async ({ prisma, params: { id, shortName } }) => await prisma.interestGroup.findUniqueOrThrow({
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

    update: serviceMethod({
        paramsSchema: z.object({
            id: z.number(),
        }),
        dataSchema: interestGroupSchemas.update,
        authorizer: async ({ prisma, params }) => {
            const { groupId } = await prisma.interestGroup.findUniqueOrThrow({
                where: { id: params.id },
                select: { groupId: true },
            })

            return interestGroupAuthers.update.dynamicFields({
                groupId,
            })
        },
        method: async ({ prisma, params: { id }, data }) => prisma.interestGroup.update({
            where: { id },
            data,
        }),
    }),

    destroy: serviceMethod({
        paramsSchema: z.object({
            id: z.number(),
        }),
        authorizer: () => interestGroupAuthers.destroy.dynamicFields({}),
        opensTransaction: true,
        method: async ({ prisma, params: { id } }) => {
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
}
