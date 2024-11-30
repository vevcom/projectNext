import 'server-only'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import { updateReleasePeriodValidation } from '@/services/cabin/validation'

export const updateReleaseGroup = ServiceMethodHandler({
    withData: true,
    validation: updateReleasePeriodValidation,
    handler: async (prisma, _, data) => await prisma.releasePeriod.update({
        where: {
            id: data.id,
        },
        data: {
            releaseTime: data.releaseTime,
            releaseUntil: data.releaseUntil,
        }
    })
})

