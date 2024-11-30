import 'server-only'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'


export const deleteReleasePeriod = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, params: { id: number }) => prisma.releasePeriod.delete({
        where: {
            id: params.id,
        }
    })
})
