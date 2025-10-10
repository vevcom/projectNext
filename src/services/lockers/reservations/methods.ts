
import '@pn-server-only'
import { lockerReservationAuthers } from './authers'
import { lockerReservationSchemas } from './schemas'
import { defineOperation } from '@/services/serviceOperation'
import { Smorekopp } from '@/services/error'
import { groupMethods } from '@/services/groups/methods'
import { z } from 'zod'

export const lockerReservationMethods = {
    /**
     * Creates a new locker reservation for a given user and locker.
     *
     * @param userId The user to create the reservation for.
     * @param lockerId The locker to reserve.
     *
     * @returns The newly created reservation object.
     */
    create: defineOperation({
        authorizer: () => lockerReservationAuthers.create.dynamicFields({}),
        paramsSchema: z.object({
            lockerId: z.number(),
        }),
        dataSchema: lockerReservationSchemas.create,
        operation: async ({ prisma, session, data, params }) => {
            // TODO: Use authers for authing in stead of this
            // Verify that user is in group
            if (data.groupId) {
                const groupUsers = await groupMethods.readUsersOfGroups({
                    bypassAuth: true,
                    params: {
                        groups: [{ groupId: data.groupId, admin: false }]
                    }
                })

                const userInGroup = groupUsers.some(groupUser => session.user && session.user.id === groupUser.id)

                if (!userInGroup) {
                    throw new Smorekopp('UNAUTHORIZED', 'Bruker må høre til gruppen de prøver å reservere for.')
                }
            }

            if (!session.user) {
                throw new Smorekopp('UNAUTHORIZED', 'Du må være logget inn for å reservere et skap.')
            }

            return await prisma.lockerReservation.create({
                data: {
                    groupId: data.groupId,
                    endDate: data.endDate,
                    userId: session.user.id,
                    lockerId: params.lockerId,
                }
            })
        },
    }),

    /**
     * Updates an existing locker reservation.
     *
     * @param id The ID of the reservation to update.
     * @param data The new data to update the reservation with.
     *
     * @returns The updated reservation object.
     */
    read: defineOperation({
        authorizer: () => lockerReservationAuthers.read.dynamicFields({}),
        paramsSchema: z.object({
            id: z.number(),
        }),
        operation: ({ prisma, params: { id } }) => prisma.lockerReservation.findUniqueOrThrow({
            where: {
                id,
            },
        })
    }),

    /**
     * Updates an existing locker reservation.
     *
     * @param id The ID of the reservation to update.
     * @param data The new data to update the reservation with.
     *
     * @returns The updated reservation object.
     */
    update: defineOperation({
        authorizer: () => lockerReservationAuthers.update.dynamicFields({}),
        paramsSchema: z.object({
            id: z.number(),
        }),
        dataSchema: lockerReservationSchemas.update,
        operation: async ({ prisma, session, data, params: { id } }) => {
            // TODO: Use authers for authing in stead of this
            // Verify that the user updating is the creator of the reservation
            const reservation = await prisma.lockerReservation.findUniqueOrThrow({
                where: {
                    id,
                },
                select: {
                    userId: true,
                }
            })

            if (session.user && session.user.id !== reservation.userId) {
                throw new Smorekopp('UNAUTHORIZED', 'Bruker har ikke tilgang til å endre reservasjonen.')
            }

            // Verify that user is in group
            if (data.groupId) {
                const groupUsers = await groupMethods.readUsersOfGroups({
                    bypassAuth: true,
                    params: {
                        groups: [{ groupId: data.groupId, admin: false }]
                    }
                })

                const userInGroup = groupUsers.some(groupUser => session.user && session.user.id === groupUser.id)

                if (!userInGroup) {
                    throw new Smorekopp('UNAUTHORIZED', 'Bruker må høre til gruppen de prøver å reservere for.')
                }
            }

            return await prisma.lockerReservation.update({
                where: {
                    id,
                },
                data: {
                    groupId: data.groupId,
                    endDate: data.endDate,
                }
            })
        },
    }),
}

