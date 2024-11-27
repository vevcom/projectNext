import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import 'server-only'


export const readAllBookingPeriods = ServiceMethodHandler({
    withData: false,
    handler: async (prisma) => await prisma.bookingPeriod.findMany(), // TODO: Implement paging
})
