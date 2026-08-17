import type { eventRegistrationIncluderDetailed, eventRegistrationSelection, REGISTRATION_READER_TYPE } from './constants'
import type { ExpandedImage } from '@/services/images/subservice/types'
import type { Prisma } from '@/prisma-generated-pn-types'

// This type will just make sure that the image is not null
export type EventRegistrationExpanded = Prisma.EventRegistrationGetPayload<{
    select: typeof eventRegistrationSelection
}> & {
    image: ExpandedImage
}

export type EventRegistrationDetailedExpanded = Prisma.EventRegistrationGetPayload<{
    include: typeof eventRegistrationIncluderDetailed,
}>

/**
 * What the dots of a user hold them back from when registering to an event. A timeout means the user
 * must wait that many minutes past the ordinary registration start of the event.
 */
export type DotPunishment = {
    type: 'none',
} | {
    type: 'timeout',
    punishmentMinutes: number,
} | {
    type: 'ban',
}

export type EventRegistrationFetcherDetails = {
    eventId: number,
    type?: REGISTRATION_READER_TYPE,
}
