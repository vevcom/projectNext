import 'server-only'
import { ServiceMethodHandler } from '../ServiceMethodHandler'

export const destroy = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, params: { id: number }) => {
        await prisma.license.delete({ where: { id: params.id } })
    }
})