import 'server-only'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import { ServerError } from '@/services/error'

export const destroy = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, params: { id: number }) => {
        const tag = await prisma.eventTag.findUniqueOrThrow({
            where: { id: params.id }
        })
        if (tag.special) {
            throw new ServerError('BAD PARAMETERS', 'Kan ikke slette spesialtagger')
        }
        await prisma.eventTag.delete({
            where: { id: params.id }
        })
    }
})
