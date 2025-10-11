import '@pn-server-only'
import { defineSubOperation } from '@/services/serviceOperation'
import { cmsParagraphSchemas } from './schemas'

export namespace CmsParagraphMethods {
    export const create = defineSubOperation({
        dataSchema: () => cmsParagraphSchemas.create,
        operation: () => ({ data, prisma }) => {
            prisma.cmsParagraph.create({ data })
        }
    })
}
