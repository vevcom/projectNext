import 'server-only'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'

export const readReleaseGroups = ServiceMethodHandler({
    withData: false,
    handler: async (prisma) => await prisma.releaseGroup.findMany({
        include: {
            bookingPeriods: true,
        },
    })
})
