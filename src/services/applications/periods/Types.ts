import type { ApplicationPeriodConfig } from './config'
import type { Image, Prisma } from '@prisma/client'

export type CountdownInfo = {
    endTime: Date,
    commiteesParticipating: {
        shortname: string,
        logo: Image
    }[]
}

export type ExpandedApplicationPeriod = Prisma.ApplicationPeriodGetPayload<{
    include: typeof ApplicationPeriodConfig.includer
}>
