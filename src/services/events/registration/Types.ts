import type { EventRegistrationConfig } from './config'
import type { Prisma } from '@prisma/client'

export type EventRegistrationExpanded = Prisma.EventRegistrationGetPayload<{
    include: typeof EventRegistrationConfig.includer
}>

export type EventRegistrationDetails = EventRegistrationExpanded[]
