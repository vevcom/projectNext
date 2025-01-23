import 'server-only'
import { updateEventValidation } from './validation'
import { updateEventAuther } from './authers'
import { ServerError } from '@/services/error'
import { ServiceMethod } from '@/services/ServiceMethod'
import { z } from 'zod'

export const updateEvent = ServiceMethod({
    paramsSchema: z.object({
        id: z.number(),
    }),
    dataValidation: updateEventValidation,
    auther: updateEventAuther,
    dynamicAuthFields: () => ({}),
    method: async ({ prisma, params, data: { tagIds, ...data } }) => {
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

        const eventUpdate = await prisma.event.update({
            where: { id: params.id },
            data,
        })
        if (!tagIds) return eventUpdate

        await prisma.eventTagEvent.deleteMany({
            where: {
                eventId: params.id,
                NOT: {
                    tagId: {
                        in: tagIds
                    }
                }
            }
        })

        await prisma.eventTagEvent.createMany({
            data: tagIds.map(tagId => ({
                eventId: params.id,
                tagId
            })),
            skipDuplicates: true
        })
        return eventUpdate
    }
})
