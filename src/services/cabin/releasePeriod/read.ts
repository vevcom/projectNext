import 'server-only'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'

export const readReleasePeriods = ServiceMethodHandler({
    withData: false,
    handler: async (prisma) => await prisma.releasePeriod.findMany()
})

