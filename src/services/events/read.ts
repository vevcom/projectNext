import 'server-only'
import { ServiceMethodHandler } from '../ServiceMethodHandler'
import { eventFilterSeletion } from './ConfigVars'
import { getOsloTime } from '@/dates/getOsloTime'
import { ReadPageInput } from '../paging/Types'
import { EventArchiveCursor, EventArchiveDetails } from './Types'

export const read = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, params: {order: number, name: string}) => {
        return await prisma.event.findUniqueOrThrow({
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
    }
})

export const readCurrent = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, params: { tags: string[] | null, visibilityFilter: object }) => {
        return await prisma.event.findMany({
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
    }
})

export const readArchivedPage = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, params: {
        paging: ReadPageInput<number, EventArchiveCursor, EventArchiveDetails>
    }) => {
        return await prisma.event.findMany({
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
    }
})