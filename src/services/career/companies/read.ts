import 'server-only'
import { CompanyRelationIncluder } from './ConfigVars'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import type { ReadPageInput } from '@/lib/paging/Types'
import type { CompanyCursor, CompanyDetails, CompanyExpanded } from './Types'

export const readPage = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, params: {
        paging: ReadPageInput<number, CompanyCursor, CompanyDetails>
    }): Promise<CompanyExpanded[]> => await prisma.company.findMany({
        ...cursorPageingSelection(params.paging.page),
        where: {
            name: {
                contains: params.paging.details.name,
                mode: 'insensitive'
            }
        },
        include: CompanyRelationIncluder
    })
})
