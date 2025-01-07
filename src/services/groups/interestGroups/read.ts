import 'server-only'
import { ReadInterestGroupAuther } from './Auther'
import { articleSectionsRealtionsIncluder } from '@/services/cms/articleSections/ConfigVars'
import { ServiceMethod } from '@/services/ServiceMethod'
import { z } from 'zod'
import type { ExpandedInterestGroup } from './Types'

export const readAllInterestGroups = ServiceMethod({
    auther: ReadInterestGroupAuther,
    dynamicAuthFields: () => ({}),
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

export const readInterestGroup = ServiceMethod({
    paramsSchema: z.object({
        id: z.number().optional(),
        shortName: z.string().optional(),
    }),
    auther: ReadInterestGroupAuther,
    dynamicAuthFields: () => ({}),
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
