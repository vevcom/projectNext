import 'server-only'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'

export const readAll = ServiceMethodHandler({
    withData: false,
    handler: async (prisma) => await prisma.lisence.findMany()
})
