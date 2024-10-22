import 'server-only'
import { ReadPageInput } from '@/services/paging/Types'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import { CompanyCursor, CompanyDetails, CompanyExpanded } from './Types'
import { cursorPageingSelection } from '@/services/paging/cursorPageingSelection'
import { CompanyRelationIncluder } from './ConfigVars'

export const readPage = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, params: {
        paging: ReadPageInput<number, CompanyCursor, CompanyDetails>
    }): Promise<CompanyExpanded[]> => {
        return await prisma.company.findMany({
            ...cursorPageingSelection(params.paging.page),
            where: {
                name: {
                    contains: params.paging.details.name,
                    mode: 'insensitive'
                }
            },
            include: CompanyRelationIncluder
        })
    }
})