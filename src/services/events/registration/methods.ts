import { EventRegistrationAuthers } from './authers'
import { EventRegistrationConfig } from './config'
import { ServiceMethod } from '@/services/ServiceMethod'
import '@pn-server-only'
import { Smorekopp } from '@/services/error'
import { ImageMethods } from '@/services/images/methods'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import type { EventRegistrationExpanded } from './Types'
import { EventRegistrationSchemas } from './schemas'


export namespace EventRegistrationMethods {

    // eslint-disable-next-line
    async function validateNewRegistration(
        prisma: Prisma.TransactionClient,
        eventId: number,
        isAdmin: boolean
    ) {
        const event = await prisma.event.findUniqueOrThrow({
            where: {
                id: eventId
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

        if (event.registrationStart > new Date() && !isAdmin) {
            throw new Smorekopp('BAD PARAMETERS', 'Cannot register for an event before the registration period.')
        }

        if (event.registrationEnd < new Date() && !isAdmin) {
            throw new Smorekopp('BAD PARAMETERS', 'Cannot register for an event after the registration period.')
        }

        if (event.places <= event._count.eventRegistrations && !event.waitingList) {
            throw new Smorekopp('BAD PARAMETERS', 'The event is full.')
        }

        return event
    }

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
            const isAdmin = session.permissions.includes('EVENT_ADMIN')

            const event = await validateNewRegistration(tx, params.eventId, isAdmin)

            const result = await tx.eventRegistration.create({
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
            return {
                result,
                onWaitingList: event.places <= event._count.eventRegistrations,
            }
        }, {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // Prevent race conditions
        }),
    })

    export const createGuest = ServiceMethod({
        auther: () => EventRegistrationAuthers.createGuest.dynamicFields({}),
        paramsSchema: z.object({
            eventId: z.number(),
        }),
        dataSchema: EventRegistrationSchemas.createGuest,
        opensTransaction: true,
        method: async ({ prisma, params, data }) => prisma.$transaction(async (tx) => {
            const event = await validateNewRegistration(tx, params.eventId, true)

            const result = await tx.eventRegistration.create({
                data: {
                    event: {
                        connect: {
                            id: params.eventId,
                        },
                    },
                    note: data.note,
                    contact: {
                        create: {
                            name: data.name,
                        },
                    },
                },
            })

            return {
                result,
                onWaitingList: event.places <= event._count.eventRegistrations,
            }
        }, {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // Prevent race conditions
        }),
    })

    // eslint-disable-next-line
    async function calculateTakeSkip(prisma: Prisma.TransactionClient, params: {
        eventId: number,
        take?: number,
        skip?: number,
        type?: EventRegistrationConfig.REGISTRATION_READER_TYPE,
    }) {
        let take = params.take
        let skip = params.skip

        if (params.type && take) {
            const event = await prisma.event.findUniqueOrThrow({
                where: {
                    id: params.eventId,
                },
            })

            if (params.type === EventRegistrationConfig.REGISTRATION_READER_TYPE.REGISTRATIONS) {
                skip = Math.min(skip ?? 0, event.places)
                take = Math.min(take, event.places - skip)
            } else {
                skip = (skip ?? 0) + event.places
            }

            if (skip === 0) {
                skip = undefined
            }
        }

        return {
            take,
            skip,
        }
    }

    export const readMany = ServiceMethod({
        auther: () => EventRegistrationAuthers.readMany.dynamicFields({}),
        paramsSchema: z.object({
            eventId: z.number().min(0),
            skip: z.number().optional(),
            take: z.number().optional(),
            type: z.nativeEnum(EventRegistrationConfig.REGISTRATION_READER_TYPE).optional(),
        }),
        method: async ({ prisma, params, session }): Promise<EventRegistrationExpanded[]> => {
            const defaultImage = await ImageMethods.readSpecial.client(prisma).execute({
                params: { special: 'DEFAULT_PROFILE_IMAGE' },
                session,
            })

            const skipTake = await calculateTakeSkip(prisma, params)
            if (skipTake.take === 0) return []

            const reults = await prisma.eventRegistration.findMany({
                where: {
                    eventId: params.eventId,
                },
                orderBy: {
                    createdAt: 'asc',
                },
                ...skipTake,
                select: EventRegistrationConfig.selection,
            })

            return reults.map(registration => ({
                ...registration,
                image: registration.user?.image || defaultImage,
            }))
        },
    })

    export const readManyDetailed = ServiceMethod({
        auther: () => EventRegistrationAuthers.readManyDetailed.dynamicFields({}),
        paramsSchema: z.object({
            eventId: z.number().min(0),
            skip: z.number().optional(),
            take: z.number().optional(),
            type: z.nativeEnum(EventRegistrationConfig.REGISTRATION_READER_TYPE).optional(),
        }),
        method: async ({ prisma, params }) => {
            const skiptake = await calculateTakeSkip(prisma, params)
            if (skiptake.take === 0) return []

            return await prisma.eventRegistration.findMany({
                where: {
                    eventId: params.eventId,
                },
                orderBy: {
                    createdAt: 'asc',
                },
                ...skiptake,
                include: EventRegistrationConfig.includerDetailed,
            })
        }
    })

    export const updateNotes = ServiceMethod({
        auther: () => EventRegistrationAuthers.updateRegistrationNotes.dynamicFields({}),
        paramsSchema: z.object({
            registrationId: z.number().min(0),
        }),
        dataSchema: EventRegistrationSchemas.updateNotes,
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
                    note: data.note,
                },
            })
        }
    })

    // TODO: Fix authing to make users be able to remove themselfes
    // And make sure they cannot sign off after the registration period
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
