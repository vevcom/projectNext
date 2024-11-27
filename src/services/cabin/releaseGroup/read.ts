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

export const readReleaseGroup = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, params: { id: number}) => await prisma.releaseGroup.findUniqueOrThrow({
        where: {
            id: params.id
        },
        include: {
            bookingPeriods: true
        }
    })
})
