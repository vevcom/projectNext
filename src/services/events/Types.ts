import type { eventFieldsToExpose } from './ConfigVars'
import type { ExpandedCmsImage } from '@/cms/images/Types'
import type { Event } from '@prisma/client'

export type EventFiltered = Pick<Event, typeof eventFieldsToExpose[number]>

export type EventFilteredWithImage = EventFiltered & {
    coverImage: Pick<ExpandedCmsImage, 'image'>
}

export type ExpandedEvent = EventFiltered

export type EventArchiveCursor = { id: number }

export type EventArchiveDetails = { name?: string }
