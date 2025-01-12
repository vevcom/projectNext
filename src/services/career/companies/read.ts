import 'server-only'
import { CompanyRelationIncluder } from './ConfigVars'
import { readCompanyAuther } from './authers'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import { ServiceMethod } from '@/services/ServiceMethod'
import { readPageInputSchemaObject } from '@/lib/paging/schema'
import { z } from 'zod'

export const readCompanyPage = ServiceMethod({
    paramsSchema: readPageInputSchemaObject(
        z.number(),
        z.object({
            id: z.number(),
        }),
        z.object({
            name: z.string().optional(),
        }),
    ), // Created from ReadPageInput<number, CompanyCursor, CompanyDetails>
    auther: readCompanyAuther,
    dynamicAuthFields: () => ({}),
    method: async ({ prisma, params }) => await prisma.company.findMany({
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
