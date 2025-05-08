import { EventRegistrationAuthers } from './authers'
import { EventRegistrationConfig } from './config'
import { ServiceMethod } from '@/services/ServiceMethod'
import '@pn-server-only'
import { Smorekopp } from '@/services/error'
import { ImageMethods } from '@/services/images/methods'
import { z } from 'zod'
import { Prisma } from '@prisma/client'


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
        method: async ({ prisma, params, session }) => prisma.$transaction(async (tx) => {
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

            const isAdmim = session.permissions.includes('EVENT_ADMIN')

            if (!event.takesRegistration) {
                throw new Smorekopp('BAD PARAMETERS', 'Cannot register for an event without registration')
            }

            if (event.registrationStart > new Date() && !isAdmim) {
                throw new Smorekopp('BAD PARAMETERS', 'Cannot register for an event before the registration period.')
            }

            if (event.registrationEnd < new Date() && !isAdmim) {
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
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // Prevent race conditions
        }),
    })

    export const readMany = ServiceMethod({
        auther: () => EventRegistrationAuthers.readMany.dynamicFields({}),
        paramsSchema: z.object({
            eventId: z.number().min(0),
            skip: z.number().optional(),
            take: z.number().optional(),
        }),
        method: async ({ prisma, params, session }) => {
            const defaultImage = await ImageMethods.readSpecial.client(prisma).execute({
                params: { special: 'DEFAULT_PROFILE_IMAGE' },
                session,
            })
            const reults = await prisma.eventRegistration.findMany({
                where: {
                    eventId: params.eventId,
                },
                take: params.take,
                skip: params.skip,
                select: EventRegistrationConfig.selection,
            })

            return reults.map(registration => ({
                ...registration,
                user: {
                    ...registration.user,
                    image: registration.user.image || defaultImage,
                }
            }))
        },
    })

    export const readManyDetailed = ServiceMethod({
        auther: () => EventRegistrationAuthers.readManyDetailed.dynamicFields({}),
        paramsSchema: z.object({
            eventId: z.number().min(0),
            skip: z.number().optional(),
            take: z.number().optional(),
        }),
        method: async ({ prisma, params }) => await prisma.eventRegistration.findMany({
            where: {
                eventId: params.eventId,
            },
            take: params.take,
            skip: params.skip,
            include: EventRegistrationConfig.includerDetailed,
        })
    })

    export const updateNotes = ServiceMethod({
        auther: () => EventRegistrationAuthers.updateRegistrationNotes.dynamicFields({}),
        paramsSchema: z.object({
            registrationId: z.number().min(0),
        }),
        dataSchema: z.object({
            notes: z.string().optional(),
        }),
        method: async ({ prisma, params, data, session }) => {
            const registration = await prisma.eventRegistration.findUnique({
                where: {
                    id: params.registrationId,
                },
                select: {
                    userId: true,
                    event: true,
                },
            })

            if (!session.user || !registration || registration.userId !== session.user.id) {
                throw new Smorekopp('UNAUTHORIZED', 'Kan ikke endre påmelding til andre.')
            }

            if (registration.event.registrationEnd < new Date()) {
                throw new Smorekopp('BAD PARAMETERS', 'Kan ikke endre påmelding etter påmeldingsfristen.')
            }

            return await prisma.eventRegistration.update({
                where: {
                    id: params.registrationId,
                },
                data: {
                    note: data.notes,
                },
            })
        }
    })

    export const destroy = ServiceMethod({
        auther: () => EventRegistrationAuthers.destroy.dynamicFields({}),
        paramsSchema: z.object({
            registrationId: z.number().min(0),
        }),
        method: async ({ prisma, params }) => await prisma.eventRegistration.delete({
            where: {
                id: params.registrationId,
            },
        }),
    })
}
