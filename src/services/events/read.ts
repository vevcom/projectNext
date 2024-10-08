import 'server-only'
import { eventFilterSeletion } from './ConfigVars'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import { cursorPageingSelection } from '@/services/paging/cursorPageingSelection'
import { getOsloTime } from '@/dates/getOsloTime'
import type { ReadPageInput } from '@/services/paging/Types'
import type { EventArchiveCursor, EventArchiveDetails } from './Types'

export const read = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, params: {order: number, name: string}) => await prisma.event.findUniqueOrThrow({
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
            paragraph: true
        }
    })
})

export const readCurrent = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, params: { tags: string[] | null, visibilityFilter: object }) => await prisma.event.findMany({
        select: {
            ...eventFilterSeletion,
            coverImage: {
                include: {
                    image: true
                }
            }
        },
        where: {
            eventEnd: {
                gte: getOsloTime()
            },
            ...params.visibilityFilter,
            EventTagEvent: params.tags ? {
                some: {
                    tag: {
                        name: {
                            in: params.tags
                        }
                    }
                }
            } : undefined
        }
    })
})

export const readArchivedPage = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, params: {
        paging: ReadPageInput<number, EventArchiveCursor, EventArchiveDetails>
    }) => await prisma.event.findMany({
        ...cursorPageingSelection(params.paging.page),
        where: {
            eventEnd: {
                lt: getOsloTime()
            },
            name: {
                contains: params.paging.details.name,
                mode: 'insensitive'
            }
        },
        select: {
            ...eventFilterSeletion,
            coverImage: {
                include: {
                    image: true
                }
            }
        },
    })
})
