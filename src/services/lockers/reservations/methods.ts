
import 'server-only'
import { LockerReservationAuthers } from './authers'
import { LockerReservationSchemas } from './schemas'
import { ServiceMethod } from '@/services/ServiceMethod'
import { readUsersOfGroups } from '@/services/groups/read'
import { Smorekopp } from '@/services/error'
import { z } from 'zod'

export namespace LockerReservationMethods {
    /**
     * Creates a new locker reservation for a given user and locker.
     *
     * @param userId The user to create the reservation for.
     * @param lockerId The locker to reserve.
     *
     * @returns The newly created reservation object.
     */
    export const create = ServiceMethod({
        auther: () => LockerReservationAuthers.create.dynamicFields({}),
        paramsSchema: z.object({
            lockerId: z.number(),
        }),
        dataSchema: LockerReservationSchemas.create,
        method: async ({ prisma, session, data, params }) => {
            // TODO: Use authers for authing in stead of this
            // Verify that user is in group
            if (data.groupId) {
                const groupUsers = await readUsersOfGroups([{ groupId: data.groupId, admin: false }])

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
    })

    /**
     * Updates an existing locker reservation.
     *
     * @param id The ID of the reservation to update.
     * @param data The new data to update the reservation with.
     *
     * @returns The updated reservation object.
     */
    export const read = ServiceMethod({
        auther: () => LockerReservationAuthers.read.dynamicFields({}),
        paramsSchema: z.object({
            id: z.number(),
        }),
        method: ({ prisma, params: { id } }) => prisma.lockerReservation.findUniqueOrThrow({
            where: {
                id,
            },
        })
    })

    /**
     * Updates an existing locker reservation.
     *
     * @param id The ID of the reservation to update.
     * @param data The new data to update the reservation with.
     *
     * @returns The updated reservation object.
     */
    export const update = ServiceMethod({
        auther: () => LockerReservationAuthers.update.dynamicFields({}),
        paramsSchema: z.object({
            id: z.number(),
        }),
        dataSchema: LockerReservationSchemas.update,
        method: async ({ prisma, session, data, params: { id } }) => {
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
                const groupUsers = await readUsersOfGroups([{ groupId: data.groupId, admin: false }])

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
    })
}

