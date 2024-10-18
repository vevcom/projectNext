import 'server-only'
import type { ExpandedInterestGroup } from './Types'
import { articleSectionsRealtionsIncluder } from '@/services/cms/articleSections/ConfigVars'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'

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
        }
    })
})

export const read = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, { id, shortName }: ReadInterestGroupArgs) => {
        return await prisma.interestGroup.findUniqueOrThrow({
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
    }
})
