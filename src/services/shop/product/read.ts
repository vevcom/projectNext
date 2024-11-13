import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import 'server-only'

export const readProducts = ServiceMethodHandler({
    withData: false,
    handler: async (prisma) => await prisma.product.findMany()
})
