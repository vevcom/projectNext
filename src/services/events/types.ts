import type { eventFilterSelection } from './constants'
import type { ExpandedCmsImage } from '@/cms/images/types'
import type { EventTag, Prisma } from '@/prisma-generated-pn-types'


export type EventFiltered = Prisma.EventGetPayload<{
    select: typeof eventFilterSelection
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
