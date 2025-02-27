
import 'server-only'
import { lockerReservationValidation } from './validation'
import { LockerReservationAuthers } from './authers'
import { ServiceMethod } from '@/services/ServiceMethod'
import { readUsersOfGroups } from '@/services/groups/read'
import { Smorekopp } from '@/services/error'
import prisma from '@/prisma'
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
            userId: z.number(),
            lockerId: z.number(),
        }),
        dataValidation: lockerReservationValidation,
        method: async ({ session, data, params }) => {
            // Verify that user is in group
            if (data.groupId) {
                const groupUsers = await readUsersOfGroups([{ groupId: data.groupId, admin: false }])

                const userInGroup = groupUsers.some(groupUser => session.user && session.user.id === groupUser.id)

                if (!userInGroup) {
                    throw new Smorekopp('UNAUTHORIZED', 'Bruker må høre til gruppen de prøver å reservere for.')
                }
            }

            return await prisma.lockerReservation.create({
                data: {
                    groupId: data.groupId,
                    endDate: data.endDate,
                    userId: params.userId,
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
        method: ({ params: { id } }) => prisma.lockerReservation.findUniqueOrThrow({
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
        dataValidation: lockerReservationValidation,
        method: async ({ session, data, params: { id } }) => {
            // Verify that the user updating is the creator of the reservation
            const reservation = await prisma.lockerReservation.findUniqueOrThrow({
                where: {
                    id,
                },
                select: {
                    userId: true,
                }
            })

            if (id !== reservation.userId) {
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
                data,
            })
        },
    })
}

