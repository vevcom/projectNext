import 'server-only'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import { updateReleaseGroupValidation } from '@/services/cabin/validation'

export const updateReleaseGroup = ServiceMethodHandler({
    withData: true,
    validation: updateReleaseGroupValidation,
    handler: async (prisma, _, data) => await prisma.releaseGroup.update({
        where: {
            id: data.id,
        },
        data: {
            releaseTime: data.releaseTime
        }
    })
})
