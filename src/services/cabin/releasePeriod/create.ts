import 'server-only'
import { createReleasePeriodValidation } from '@/services/cabin/validation'
import { ServiceMethod } from '@/services/ServiceMethod'
import { createReleasePeriodAuther } from '@/services/cabin/authers'

export const createReleasePeriod = ServiceMethod({
    auther: () => createReleasePeriodAuther.dynamicFields({}),
    dataValidation: createReleasePeriodValidation,
    method: async ({ prisma, data }) => await prisma.releasePeriod.create({
        data: {
            releaseUntil: data.releaseUntil,
            releaseTime: data.releaseTime,
        }
    })
})
