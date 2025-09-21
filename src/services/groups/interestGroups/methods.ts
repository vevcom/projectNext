import '@pn-server-only'
import { InterestGroupAuthers } from './authers'
import { InterestGroupSchemas } from './schemas'
import { readCurrentOmegaOrder } from '@/services/omegaOrder/read'
import { serviceMethod } from '@/services/serviceMethod'
import { articleSectionsRealtionsIncluder } from '@/services/cms/articleSections/ConfigVars'
import { z } from 'zod'
import type { ExpandedInterestGroup } from './Types'

export namespace InterestGroupMethods {
    export const create = serviceMethod({
        dataSchema: InterestGroupSchemas.create,
        authorizer: () => InterestGroupAuthers.create.dynamicFields({}),
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
    })

    export const readMany = serviceMethod({
        authorizer: () => InterestGroupAuthers.readMany.dynamicFields({}),
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
    })

    export const read = serviceMethod({
        paramsSchema: z.object({
            id: z.number().optional(),
            shortName: z.string().optional(),
        }),
        authorizer: () => InterestGroupAuthers.read.dynamicFields({}),
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
    })

    export const update = serviceMethod({
        paramsSchema: z.object({
            id: z.number(),
        }),
        dataSchema: InterestGroupSchemas.update,
        authorizer: async ({ params }) => InterestGroupAuthers.update.dynamicFields({
            groupId: (
                await read({
                    params: { id: params.id },
                    bypassAuth: true,
                })
            ).groupId,
        }),
        method: async ({ prisma, params: { id }, data }) => prisma.interestGroup.update({
            where: { id },
            data,
        }),
    })

    export const destroy = serviceMethod({
        paramsSchema: z.object({
            id: z.number(),
        }),
        authorizer: () => InterestGroupAuthers.destroy.dynamicFields({}),
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
    })
}
