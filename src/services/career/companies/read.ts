import 'server-only'
import { ReadPageInput } from '@/services/paging/Types'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import { CompanyCursor, CompanyDetails } from './Types'
import { cursorPageingSelection } from '@/services/paging/cursorPageingSelection'

export const readPage = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, params: {
        paging: ReadPageInput<number, CompanyCursor, CompanyDetails>
    }) => {
        return await prisma.company.findMany({
            ...cursorPageingSelection(params.paging.page),
            where: {
                name: {
                    contains: params.paging.details.name,
                    mode: 'insensitive'
                }
            }
        })
    }
})