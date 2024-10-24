import 'server-only'
import { updateInterestGroupValidation } from './validation'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'

export const update = ServiceMethodHandler({
    withData: true,
    validation: updateInterestGroupValidation,
    handler: async (prisma, { id }: { id: number }, data) => prisma.interestGroup.update({
        where: { id },
        data,
    })
})
