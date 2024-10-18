import 'server-only'
import { articleSectionsRealtionsIncluder } from '@/services/cms/articleSections/ConfigVars'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import type { ExpandedInterestGroup } from './Types'

type ReadInterestGroupArgs = {
    id?: number,
    shortName?: string,
}

export const readAll = ServiceMethodHandler({
    withData: false,
    handler: async (prisma): Promise<ExpandedInterestGroup[]> => prisma.interestGroup.findMany({
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

export const read = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, { id, shortName }: ReadInterestGroupArgs) => await prisma.interestGroup.findUniqueOrThrow({
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
