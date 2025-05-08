import type { EventRegistrationConfig } from './config'
import type { Image, Prisma } from '@prisma/client'

// This type will just make sure that the image is not null
export type EventRegistrationExpanded = Omit<Prisma.EventRegistrationGetPayload<{
    select: typeof EventRegistrationConfig.selection
}>, 'user'> & {
    user: Omit<Prisma.UserGetPayload<{
        select: typeof EventRegistrationConfig.selection.user.select
    }>, 'image'>,
} & {
    user: {
        image: Image,
    },
}

export type EventRegistrationDetailedExpanded = Prisma.EventRegistrationGetPayload<{
    include: typeof EventRegistrationConfig.includerDetailed
}>

export type EventRegistrationFetcherDetails = {
    eventId: number,
    type?: EventRegistrationConfig.REGISTRATION_READER_TYPE,
}
