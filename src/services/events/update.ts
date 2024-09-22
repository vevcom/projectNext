import 'server-only'
import { updateEventValidation } from './validation'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import { ServerError } from '../error'

export const update = ServiceMethodHandler({
    withData: true,
    validation: updateEventValidation,
    handler: async (prisma, params: { id: number }, data) => {
        const event = await prisma.event.findUniqueOrThrow({
            where: { id: params.id }
        })
        
        if ((data.eventStart ?? event?.eventStart) > (data.eventEnd ?? event?.eventEnd)) {
            throw new ServerError('BAD PARAMETERS', 'Event må jo strate før den slutter')
        }

        if (data.registrationStart && data.registrationEnd && data.registrationStart > data.registrationEnd) {
            throw new ServerError('BAD PARAMETERS', 'Påmelding må jo strate før den slutter')
        }

        if (data.registrationStart && !data.registrationEnd || !data.registrationStart && data.registrationEnd) {
            throw new ServerError('BAD PARAMETERS', 'Begge registreringsdatoer må være satt eller ingen')
        }

        return await prisma.event.update({
            where: { id: params.id },
            data
        })
    }
})