import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import 'server-only'
import { createEventTagValidation } from './validation'

export const create = ServiceMethodHandler({
    withData: true,
    validation: createEventTagValidation,
    handler: async (prisma, params, data) => {
        return await prisma.eventTag.create({
            data,
        })
    }
})