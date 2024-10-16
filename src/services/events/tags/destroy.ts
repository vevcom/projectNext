import 'server-only'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'

export const destroy = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, params: { id: number }) => {
        await prisma.eventTag.delete({
            where: { id: params.id }
        })
    }
})
