import type { EventConfig } from './config'
import type { ExpandedCmsImage } from '@/cms/images/Types'
import type { Event, EventTag } from '@prisma/client'

export type EventFiltered = Pick<Event, typeof EventConfig.fieldsToExpose[number]>

export type EventExpanded = EventFiltered & {
    coverImage: Pick<ExpandedCmsImage, 'image'>
    tags: EventTag[]
}

export type ExpandedEvent = EventFiltered

export type EventArchiveCursor = { id: number }

export type EventArchiveDetails = { name?: string, tags: string[] | null }
