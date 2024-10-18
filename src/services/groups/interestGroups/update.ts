import 'server-only'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import { updateInterestGroupValidation } from './validation'

export const update = ServiceMethodHandler({
    withData: true,
    validation: updateInterestGroupValidation,
    handler: async (prisma, { id }: { id: number }, data) => prisma.interestGroup.update({
        where: { id },
        data,
    })
})
