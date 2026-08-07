import type { committeesParticipatingincluder } from './constants'
import type { Image, Prisma } from '@/prisma-generated-pn-types'

export type CountdownInfo = {
    endTime: Date,
    commiteesParticipating: {
        shortName: string,
        logo: Image
    }[]
}

type RawExpandedApplicationPeriod = Prisma.ApplicationPeriodGetPayload<{
    include: typeof committeesParticipatingincluder
}>

// committee.logoImage is resolved to a non-null default by applicationPeriodOperations.read,
// unlike the raw (nullable) shape committeesParticipatingincluder would otherwise imply.
export type ExpandedApplicationPeriod = Omit<RawExpandedApplicationPeriod, 'committeesParticipating'> & {
    committeesParticipating: (
        Omit<RawExpandedApplicationPeriod['committeesParticipating'][number], 'committee'> & {
            committee: Omit<RawExpandedApplicationPeriod['committeesParticipating'][number]['committee'], 'logoImage'> & {
                logoImage: Image
            }
        }
    )[]
}
