import 'server-only'
import { eventFilterSeletion } from './ConfigVars'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import { getOsloTime } from '@/lib/dates/getOsloTime'
import type { ReadPageInput } from '@/lib/paging/Types'
import type { EventArchiveCursor, EventArchiveDetails } from './Types'

export const read = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, params: {order: number, name: string}) => {
        const event = await prisma.event.findUniqueOrThrow({
            where: {
                order_name: {
                    order: params.order,
                    name: params.name
                }
            },
            include: {
                coverImage: {
                    include: {
                        image: true
                    }
                },
                paragraph: true,
                eventTagEvents: {
                    include: {
                        tag: true
                    }
                }
            }
        })
        return {
            ...event,
            tags: event.eventTagEvents.map(ete => ete.tag)
        }
    }
})

const eventTagSelector = (tags: string[] | null) => (tags ? {
    some: {
        tag: {
            name: {
                in: tags
            }
        }
    }
} : undefined)

export const readCurrent = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, params: { tags: string[] | null }) => {
        const events = await prisma.event.findMany({
            select: {
                ...eventFilterSeletion,
                coverImage: {
                    include: {
                        image: true
                    }
                },
                eventTagEvents: {
                    include: {
                        tag: true
                    }
                }
            },
            where: {
                eventEnd: {
                    gte: getOsloTime()
                },
                eventTagEvents: eventTagSelector(params.tags)
            }
        })
        return events.map(event => ({
            ...event,
            tags: event.eventTagEvents.map(ete => ete.tag)
        }))
    }
})

export const readArchivedPage = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, params: {
        paging: ReadPageInput<number, EventArchiveCursor, EventArchiveDetails>
    }) => {
        const events = await prisma.event.findMany({
            ...cursorPageingSelection(params.paging.page),
            where: {
                eventEnd: {
                    lt: getOsloTime()
                },
                name: {
                    contains: params.paging.details.name,
                    mode: 'insensitive'
                },
                eventTagEvents: eventTagSelector(params.paging.details.tags)
            },
            select: {
                ...eventFilterSeletion,
                coverImage: {
                    include: {
                        image: true
                    }
                },
                eventTagEvents: {
                    include: {
                        tag: true
                    }
                }
            },
        })
        return events.map(event => ({
            ...event,
            tags: event.eventTagEvents.map(ete => ete.tag)
        }))
    }
})
