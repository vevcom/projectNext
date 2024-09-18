import 'server-only'
import { ServiceMethodHandler } from '../ServiceMethodHandler'
import { eventFilterSeletion } from './ConfigVars'

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
                }
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
                    gte: new Date()
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