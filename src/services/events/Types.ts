import type { EventConfig } from './config'
import type { ExpandedCmsImage } from '@/cms/images/Types'
import type { EventTag, Prisma } from '@prisma/client'


export type EventFiltered = Prisma.EventGetPayload<{
    select: typeof EventConfig.filterSeletion
}> & {
    numOfRegistrations: number,
    numOnWaitingList: number,
}

export type EventExpanded = EventFiltered & {
    coverImage: Pick<ExpandedCmsImage, 'image'>
    tags: EventTag[],
    onWaitingList?: boolean,
}

export type EventArchiveCursor = { id: number }

export type EventArchiveDetails = { name?: string, tags: string[] | null }
