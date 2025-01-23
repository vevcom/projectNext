import 'server-only'
import { eventFilterSeletion } from './ConfigVars'
import { readArchivedEventsPageAuther, readCurrentEventsAuther, readEventAuther } from './authers'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import { getOsloTime } from '@/lib/dates/getOsloTime'
import { ServiceMethod } from '@/services/ServiceMethod'
import { readPageInputSchemaObject } from '@/lib/paging/schema'
import { z } from 'zod'

export const readEvent = ServiceMethod({
    paramsSchema: z.object({
        order: z.number(),
        name: z.string(),
    }),
    auther: readEventAuther, // Temp
    dynamicAuthFields: () => ({}),
    method: async ({ prisma, params }) => {
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


export const readCurrentEvents = ServiceMethod({
    paramsSchema: z.object({
        tags: z.array(z.string()).nullable(),
    }),
    auther: readCurrentEventsAuther,
    dynamicAuthFields: () => ({}),
    method: async ({ prisma, params }) => {
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

export const readArchivedEventsPage = ServiceMethod({
    paramsSchema: readPageInputSchemaObject(
        z.number(),
        z.object({
            id: z.number(),
        }),
        z.object({
            name: z.string().optional(),
            tags: z.array(z.string()).nullable(),
        }),
    ), // Converted from ReadPageInput<number, EventArchiveCursor, EventArchiveDetails>
    auther: readArchivedEventsPageAuther,
    dynamicAuthFields: () => ({}),
    method: async ({ prisma, params }) => {
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
