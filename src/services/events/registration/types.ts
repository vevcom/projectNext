import type { eventRegistrationIncluderDetailed, eventRegistrationSelection, REGISTRATION_READER_TYPE } from './constants'
import type { Image, Prisma } from '@/prisma-generated-pn-types'

// This type will just make sure that the image is not null
export type EventRegistrationExpanded = Prisma.EventRegistrationGetPayload<{
    select: typeof eventRegistrationSelection
}> & {
    image: Image
}

export type EventRegistrationDetailedExpanded = Prisma.EventRegistrationGetPayload<{
    include: typeof eventRegistrationIncluderDetailed,
}>

export type EventRegistrationFetcherDetails = {
    eventId: number,
    type?: REGISTRATION_READER_TYPE,
}
