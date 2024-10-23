import 'server-only'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import { ServerError } from '@/services/error'

export const destroy = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, { id }: { id: number }) => {
        const cmsLink = await prisma.cmsLink.findUniqueOrThrow({
            where: { id }
        })
        if (cmsLink.special) throw new ServerError('BAD PARAMETERS', 'Kan ikke slette spesial link')
        return prisma.cmsLink.delete({
            where: { id }
        })
    }
})