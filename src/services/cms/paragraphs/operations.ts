import { defineSubOperation } from '@/services/serviceOperation'
import '@pn-server-only'
import { z } from 'zod'

export namespace CmsParagraphMethods {

    export const create = defineSubOperation({
        paramsSchema: () => z.object({ id: z.number() }),
        dataSchema: () => z.object({
            title: z.string().min(2).max(100),
            content: z.string().min(2).max(10000),
        }),
        operation: () => ({ params, data, prisma }) => {
            // Implementation for creating a CMS paragraph
            console.log('Creating CMS paragraph with data:', { data, params, prisma })
        }
    })
}
