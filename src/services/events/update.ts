import 'server-only'
import { updateEventValidation } from './validation'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'

export const update = ServiceMethodHandler({
    withData: true,
    validation: updateEventValidation,
    handler: async (prisma, params: { id: number }, data) => {
        return await prisma.event.update({
            where: { id: params.id },
            data
        })
    }
})