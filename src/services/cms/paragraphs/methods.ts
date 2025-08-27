import { SubServiceMethod } from '@/services/SubServiceMethod'
import '@pn-server-only'
import { CmsParagraphSchemas } from './schemas'
import { z } from 'zod'

export namespace CmsParagraphMethods {

    export const create = SubServiceMethod({
        opensTransaction: false,
        paramsSchema: () => z.object({ id: z.number() }),
        dataSchema: CmsParagraphSchemas.create,
        method: () => ({ prisma, data, params }) => {
            // Implementation for creating a CMS paragraph
            params
            prisma.cmsParagraph.create({ data })
        }
    })
}
