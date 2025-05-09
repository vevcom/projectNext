import type { EventRegistrationConfig } from './config'
import type { Image, Prisma } from '@prisma/client'

// This type will just make sure that the image is not null
export type EventRegistrationExpanded = Prisma.EventRegistrationGetPayload<{
    select: typeof EventRegistrationConfig.selection
}> & {
    image: Image
}

export type EventRegistrationDetailedExpanded = Prisma.EventRegistrationGetPayload<{
    include: typeof EventRegistrationConfig.includerDetailed
}>

export type EventRegistrationFetcherDetails = {
    eventId: number,
    type?: EventRegistrationConfig.REGISTRATION_READER_TYPE,
}
