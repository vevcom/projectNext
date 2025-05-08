import type { EventRegistrationConfig } from './config'
import type { Image, Prisma } from '@prisma/client'

export type EventRegistrationExpanded = Omit<Prisma.EventRegistrationGetPayload<{
    include: typeof EventRegistrationConfig.includer
}>, 'user'> & {
    user: Omit<Prisma.UserGetPayload<{
        select: typeof EventRegistrationConfig.includer.user.select
    }>, 'image'>,
} & {
    user: {
        image: Image,
    },
}

export type EventRegistrationFetcherDetails = {
    eventId: number,
}
