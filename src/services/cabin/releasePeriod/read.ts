import 'server-only'
import { ServiceMethod } from '@/services/ServiceMethod'
import { readReleasePeriodAuther } from '@/services/cabin/authers'

export const readReleasePeriods = ServiceMethod({
    auther: () => readReleasePeriodAuther.dynamicFields({}),
    method: async ({ prisma }) => await prisma.releasePeriod.findMany({
        orderBy: {
            releaseUntil: 'desc',
        }
    })
})

