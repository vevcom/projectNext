import 'server-only'
import { updateReleasePeriodValidation } from '@/services/cabin/validation'
import { ServiceMethod } from '@/services/ServiceMethod'
import { updateReleasePeriodAuther } from '@/services/cabin/authers'

export const updateReleasePeriod = ServiceMethod({
    auther: () => updateReleasePeriodAuther.dynamicFields({}),
    dataValidation: updateReleasePeriodValidation,
    method: async ({ prisma, data }) => await prisma.releasePeriod.update({
        where: {
            id: data.id,
        },
        data: {
            releaseTime: data.releaseTime,
            releaseUntil: data.releaseUntil,
        }
    })
})

