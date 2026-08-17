import '@pn-server-only'
import { eventRegistrationIncluderDetailed, eventRegistrationSelection, REGISTRATION_READER_TYPE } from './constants'
import { eventRegistrationAuth } from './auth'
import { eventRegistrationSchemas } from './schemas'
import { dotOperations } from '@/services/dots/operations'
import { displayDate } from '@/lib/dates/displayDate'
import { Smorekopp } from '@/services/error'
import { standardImageCollectionOperations } from '@/services/images/standard/operations'
import { notificationOperations } from '@/services/notifications/operations'
import { sendSystemMail } from '@/lib/email/send'
import { userFilterSelection } from '@/services/users/constants'
import { defineOperation, defineSubOperation } from '@/services/serviceOperation'
import { z } from 'zod'
import type { Prisma } from '@/prisma-generated-pn-types'
import type { DotPunishment, EventRegistrationExpanded } from './types'

/**
 * What the dots of a user hold them back from when registering to an event.
 */
const dotPunishmentOfUser = defineSubOperation({
    paramsSchema: () => z.object({ userId: z.number().min(0) }),
    operation: () => async ({ prisma, params }): Promise<DotPunishment> => {
        const dots = await dotOperations.internal.numberOfActiveDotsForUser.internalCall({
            params,
            prisma,
        })

        if (dots >= 5) return { type: 'ban' }
        if (dots >= 4) return { type: 'timeout', punishmentMinutes: 24 * 60 }
        if (dots >= 3) return { type: 'timeout', punishmentMinutes: 3 * 60 }
        if (dots >= 2) return { type: 'timeout', punishmentMinutes: 10 }
        return { type: 'none' }
    }
})

/**
 * Checks the dots of the user registering: dots either hold the user back until a while after the
 * ordinary registration start of the event, or ban them from registering at all.
 *
 * @param registrationStart - The ordinary registration start of the event. A timeout counts from it.
 * @param userId - The user being registered.
 * @param isAdmin - Admins register on behalf of others, and are not held back by the dots of anyone.
 */
async function validateDotPunishmentOfRegistration(
    prisma: Prisma.TransactionClient,
    registrationStart: Date,
    userId: number,
    isAdmin: boolean
) {
    if (isAdmin) return

    const punishment = await dotPunishmentOfUser.internalCall({
        params: { userId },
        prisma,
    })

    if (punishment.type === 'ban') {
        throw new Smorekopp('BAD PARAMETERS', 'Du har for mange prikker til å melde deg på arrangementer.')
    }

    if (punishment.type === 'none') return

    const startForUser = new Date(registrationStart.getTime() + punishment.punishmentMinutes * 60 * 1000)

    if (startForUser > new Date()) {
        throw new Smorekopp(
            'BAD PARAMETERS',
            `Du har prikker, og kan derfor først melde deg på ${displayDate(startForUser)}.`
        )
    }
}

export const eventRegistrationOperations = {
    create: defineOperation({
        paramsSchema: z.object({
            userId: z.number().min(0),
            eventId: z.number().min(0),
        }),
        authorizer: ({ params }) => eventRegistrationAuth.create.dynamicFields({
            userId: params.userId,
        }),
        opensTransaction: true,
        operation: async ({ prisma, params, session }) => {
            const isAdmin = session.permissions.includes('EVENT_ADMIN')
            const event = await preValidateRegistration(prisma, params.eventId, isAdmin)

            await validateDotPunishmentOfRegistration(prisma, event.registrationStart, params.userId, isAdmin)

            const result = await prisma.eventRegistration.create({
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

            const updatedEvent = await postValidateRegistration(prisma, result.id, params.eventId)

            return {
                result,
                onWaitingList: updatedEvent.places < updatedEvent._count.eventRegistrations,
            }
        },
    }),

    dotPunishmentOfUser: dotPunishmentOfUser.implement({
        authorizer: ({ params }) => eventRegistrationAuth.dotPunishmentOfUser.dynamicFields({
            userId: params.userId,
        }),
        ownershipCheck: () => true,
    }),

    createGuest: defineOperation({
        authorizer: () => eventRegistrationAuth.createGuest.dynamicFields({}),
        paramsSchema: z.object({
            eventId: z.number(),
        }),
        dataSchema: eventRegistrationSchemas.createGuest,
        opensTransaction: true,
        operation: async ({ prisma, params, data }) => {
            await preValidateRegistration(prisma, params.eventId, true)
            const result = await prisma.eventRegistration.create({
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

            const updatedEvent = await postValidateRegistration(prisma, result.id, params.eventId)

            return {
                result,
                onWaitingList: updatedEvent.places < updatedEvent._count.eventRegistrations,
            }
        },
    }),

    readMany: defineOperation({
        authorizer: () => eventRegistrationAuth.readMany.dynamicFields({}),
        paramsSchema: z.object({
            eventId: z.number().min(0),
            skip: z.number().optional(),
            take: z.number().optional(),
            type: z.nativeEnum(REGISTRATION_READER_TYPE).optional(),
        }),
        operation: async ({ prisma, params }): Promise<EventRegistrationExpanded[]> => {
            const defaultImage = await standardImageCollectionOperations.readStandardImage({
                params: { standardImage: 'DEFAULT_PROFILE_IMAGE' },
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
                select: eventRegistrationSelection,
            })

            return reults.map(registration => ({
                ...registration,
                image: registration.user?.image || defaultImage,
            }))
        },
    }),

    readManyDetailed: defineOperation({
        authorizer: () => eventRegistrationAuth.readManyDetailed.dynamicFields({}),
        paramsSchema: z.object({
            eventId: z.number().min(0),
            skip: z.number().optional(),
            take: z.number().optional(),
            type: z.nativeEnum(REGISTRATION_READER_TYPE).optional(),
        }),
        operation: async ({ prisma, params }) => {
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
                include: eventRegistrationIncluderDetailed,
            })
        }
    }),

    updateNotes: defineOperation({
        authorizer: () => eventRegistrationAuth.updateRegistrationNotes.dynamicFields({}),
        paramsSchema: z.object({
            registrationId: z.number().min(0),
        }),
        dataSchema: eventRegistrationSchemas.updateNotes,
        operation: async ({ prisma, params, data, session }) => {
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
    }),

    destroy: defineOperation({
        authorizer: () => eventRegistrationAuth.destroy.dynamicFields({}),
        paramsSchema: z.object({
            registrationId: z.number().min(0),
        }),
        operation: async ({ prisma, params, session }) => {
            const isAdmin = session.permissions.includes('EVENT_ADMIN')
            const registration = await prisma.eventRegistration.findUniqueOrThrow({
                where: {
                    id: params.registrationId,
                },
                select: {
                    event: {
                        include: {
                            _count: {
                                select: {
                                    eventRegistrations: true,
                                },
                            },
                            eventRegistrations: {
                                select: {
                                    id: true,
                                },
                            }
                        }
                    },
                    userId: true,
                },
            })

            if (!isAdmin && (session.user === null || registration.userId !== session.user.id)) {
                throw new Smorekopp('UNAUTHORIZED', 'Kan ikke avregistrere andre.')
            }

            if (registration.event.registrationEnd < new Date() && !isAdmin) {
                throw new Smorekopp(
                    'BAD PARAMETERS',
                    'Kan ikke avregistrere etter påmeldingsfristen. Ta kontakt med de som arrangerer.'
                )
            }

            await prisma.eventRegistration.delete({
                where: {
                    id: params.registrationId,
                },
            })

            // FIXME: there is potentially a race contidition,
            // where a person is added to the waiting list,
            // after the event was fetched, and before the registration was deleted.
            // I this a OCC can be a solution, with a version number on the event.
            if (registration.event._count.eventRegistrations <= registration.event.places ||
                registration.event.eventRegistrations
                    .map(reg => reg.id)
                    .indexOf(params.registrationId) >= registration.event.places
            ) {
                return
            }

            const nextInLine = await prisma.eventRegistration.findFirst({
                where: {
                    eventId: registration.event.id,
                },
                skip: registration.event.places - 1,
                orderBy: {
                    id: 'asc',
                },
                include: {
                    user: {
                        select: userFilterSelection,
                    },
                    contact: true,
                }
            })

            if (!nextInLine) return

            const title = 'Opprykk fra venteliste ved Omegas nettsider'
            const message = `Gratulerer! Du har rykket opp fra venteliste på arrangementet ${registration.event.name}.`

            if (nextInLine.user) {
                await notificationOperations.createSpecial.internalCall({
                    params: {
                        special: 'EVENT_WAITINGLIST_PROMOTION',
                    },
                    data: {
                        title,
                        message,
                        userIdList: [nextInLine.user.id],
                    },
                })
            }

            if (nextInLine.contact && nextInLine.contact.email) {
                await sendSystemMail(
                    nextInLine.contact.email,
                    title,
                    message
                )
            }
        }
    })
}

async function preValidateRegistration(
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

async function postValidateRegistration(
    prisma: Prisma.TransactionClient,
    registrationId: number,
    eventId: number
) {
    const event = await prisma.event.findUniqueOrThrow({
        where: {
            id: eventId
        },
        select: {
            waitingList: true,
            places: true,
            _count: {
                select: {
                    eventRegistrations: {
                        where: {
                            id: {
                                lte: registrationId,
                            },
                        },
                    },
                },
            },
        },
    })

    if (event.places < event._count.eventRegistrations && !event.waitingList) {
        await prisma.eventRegistration.delete({
            where: {
                id: registrationId,
            },
        })

        throw new Smorekopp('BAD PARAMETERS', 'The event is full.')
    }

    return event
}

async function calculateTakeSkip(prisma: Prisma.TransactionClient, params: {
    eventId: number,
    take?: number,
    skip?: number,
    type?: REGISTRATION_READER_TYPE,
}) {
    let take = params.take
    let skip = params.skip

    if (params.type && take) {
        const event = await prisma.event.findUniqueOrThrow({
            where: {
                id: params.eventId,
            },
        })

        if (params.type === REGISTRATION_READER_TYPE.REGISTRATIONS) {
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
