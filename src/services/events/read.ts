import 'server-only'
import { ServiceMethodHandler } from '../ServiceMethodHandler'
import { eventFilterSeletion } from './ConfigVars'

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