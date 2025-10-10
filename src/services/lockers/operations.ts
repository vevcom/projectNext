import '@pn-server-only'
import { lockerReservationIncluder } from './reservations/config'
import { lockersSchemas } from './schemas'
import { lockerAuthers } from './authers'
import { defineOperation } from '@/services/serviceOperation'
import { ServerError } from '@/services/error'
import { readPageInputSchemaObject } from '@/lib/paging/schema'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import { z } from 'zod'
import type { Prisma } from '@prisma/client'
import type { LockerWithReservation } from '@/services/lockers/Types'

export async function updateLockerReservationIfExpired(prisma: Prisma.TransactionClient, locker: LockerWithReservation) {
    if (!locker.LockerReservation.length) return

    const reservation = locker.LockerReservation[0]

    if (reservation.endDate === null) return

    if (reservation.endDate.getTime() < Date.now()) {
        const updateResult = await prisma.lockerReservation.update({
            where: {
                id: locker.LockerReservation[0].id
            },
            data: {
                active: false
            }
        })
        if (!updateResult) {
            throw new ServerError('NOT FOUND', 'lockerReservation not found while updating')
        }
        locker.LockerReservation = []
    }
}
export const lockerOperations = {
    /**
     * Creates a new locker.
     *
     * @param data - The locker data.
     *
     * @returns The newly created locker object.
     */
    create: defineOperation({
        authorizer: () => lockerAuthers.create.dynamicFields({}),
        dataSchema: lockersSchemas.create,
        operation: async ({ prisma, data }) => {
            console.log(data)
            return await prisma.locker.create({
                data,
            })
        }
    }),

    /**
     * Reads a locker. Expired locker reservations are updated when reading.
     *
     * @param id - The id of the locker.
     *
     * @returns The locker object.
     */
    read: defineOperation({
        authorizer: () => lockerAuthers.read.dynamicFields({}),
        paramsSchema: z.object({
            id: z.number(),
        }),
        operation: async ({ prisma, params: { id } }) => {
            const locker = await prisma.locker.findUniqueOrThrow({
                where: {
                    id,
                },
                include: lockerReservationIncluder
            })

            await updateLockerReservationIfExpired(prisma, locker)

            return locker
        }
    }),

    /**
     * Reads a page of lockers. Expired locker reservations are updated when reading.
     *
     * @param paging - The paging data.
     *
     * @returns A list of locker objects.
     */
    readPage: defineOperation({
        authorizer: () => lockerAuthers.readPage.dynamicFields({}),
        paramsSchema: readPageInputSchemaObject(
            z.number(),
            z.object({
                id: z.number(),
            }),
            z.any(),
        ),
        operation: async ({ prisma, params }) => {
            const lockers = await prisma.locker.findMany({
                ...cursorPageingSelection(params.paging.page),
                orderBy: {
                    id: 'asc'
                },
                include: lockerReservationIncluder,
            })

            await Promise.all(lockers.map((locker) => updateLockerReservationIfExpired(prisma, locker)))

            return lockers
        }
    }),
}
