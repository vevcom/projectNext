import 'server-only'
import { interestGroupAuthers } from './authers'
import { interestGroupSchemas } from './schemas'
import { readCurrentOmegaOrder } from '@/services/omegaOrder/read'
import { ServiceMethod } from '@/services/ServiceMethod'
import { articleSectionsRealtionsIncluder } from '@/services/cms/articleSections/ConfigVars'
import { z } from 'zod'
import type { ExpandedInterestGroup } from './Types'

const create = ServiceMethod({
    dataSchema: interestGroupSchemas.create,
    auther: () => interestGroupAuthers.create.dynamicFields({}),
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

const readMany = ServiceMethod({
    auther: () => interestGroupAuthers.readMany.dynamicFields({}),
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

const read = ServiceMethod({
    paramsSchema: z.object({
        id: z.number().optional(),
        shortName: z.string().optional(),
    }),
    auther: () => interestGroupAuthers.read.dynamicFields({}),
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

const update = ServiceMethod({
    paramsSchema: z.object({
        id: z.number(),
    }),
    dataSchema: interestGroupSchemas.update,
    auther: async ({ params }) => interestGroupAuthers.update.dynamicFields({
        groupId: (
            await read.newClient().execute({
                params: { id: params.id },
                session: null,
            })
        ).groupId,
    }),
    method: async ({ prisma, params: { id }, data }) => prisma.interestGroup.update({
        where: { id },
        data,
    }),
})

const destroy = ServiceMethod({
    paramsSchema: z.object({
        id: z.number(),
    }),
    auther: () => interestGroupAuthers.destroy.dynamicFields({}),
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

export const interestGroupMethods = {
    create,
    readMany,
    read,
    update,
    destroy,
} as const
