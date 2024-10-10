import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import 'server-only'
import { createEventRegistrationValidation } from './validation'

export const create = ServiceMethodHandler({
    withData: true,
    validation: createEventRegistrationValidation,
    handler: async (prisma, { userId, eventId }: { userId: number, eventId: number }, data) => {
        return await prisma.eventRegistration.create({
            data: {
                ...data,
                userId,
                eventId,
            }
        })
    }
})