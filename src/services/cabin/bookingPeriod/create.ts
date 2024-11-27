import 'server-only'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import { createBookingPeriodValidation } from '@/services/cabin/validation'


export const createBookingPeriod = ServiceMethodHandler({
    withData: true,
    validation: createBookingPeriodValidation,
    handler: async (prisma, _, data) => await prisma.bookingPeriod.create({
        data,
    })
})
