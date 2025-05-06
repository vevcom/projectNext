import { EventRegistrationAuthers } from './authers'
import { ServiceMethod } from '@/services/ServiceMethod'
import '@pn-server-only'
import { Smorekopp } from '@/services/error'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { connect } from 'http2'


export namespace EventRegistrationMethods {

    export const create = ServiceMethod({
        paramsSchema: z.object({
            userId: z.number().min(0),
            eventId: z.number().min(0),
        }),
        auther: ({ params }) => EventRegistrationAuthers.create.dynamicFields({
            userId: params.userId,
        }),
        opensTransaction: true,
        method: async ({ prisma, params }) => prisma.$transaction(async (tx) => {
            const event = await tx.event.findUniqueOrThrow({
                where: {
                    id: params.eventId
                },
                include: {
                    _count: {
                        select: {
                            eventRegistrations: true,
                        },
                    },
                },
            })

            if (!event.takesRegistration) {
                throw new Smorekopp('BAD PARAMETERS', 'Cannot register for an event without registration')
            }

            if (event.registrationStart > new Date()) {
                throw new Smorekopp('BAD PARAMETERS', 'Cannot register for an event before the registration period.')
            }

            if (event.registrationEnd < new Date()) {
                throw new Smorekopp('BAD PARAMETERS', 'Cannot register for an event after the registration period.')
            }

            if (event.places <= event._count.eventRegistrations) {
                throw new Smorekopp('BAD PARAMETERS', 'The event is full.')
            }

            return await tx.eventRegistration.create({
                data: {
                    user: {
                        connect: {
                            id: params.userId,
                        },
                    },
                    event: {
                        connect: {
                            id: params.eventId,
                        },
                    },
                },
            })
        }, {
            // TODO: Prevent race conditions
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        }),
    })
}
