import type { committeesParticipatingincluder } from './constants'
import type { Image, Prisma } from '@/prisma-generated-pn-types'

export type CountdownInfo = {
    endTime: Date,
    commiteesParticipating: {
        shortName: string,
        logo: Image
    }[]
}

export type ExpandedApplicationPeriod = Prisma.ApplicationPeriodGetPayload<{
    include: typeof committeesParticipatingincluder
}>
