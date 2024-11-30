import 'server-only'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import { createReleasePeriodValidation } from '@/services/cabin/validation'

export const createReleasePeriod = ServiceMethodHandler({
    withData: true,
    validation: createReleasePeriodValidation,
    handler: async (prisma, _, data) => await prisma.releasePeriod.create({
        data: {
            releaseUntil: data.releaseUntil,
            releaseTime: data.releaseTime,
        }
    })
})
