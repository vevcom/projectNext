import 'server-only'
import { lockerReservationIncluder } from './reservations/config'
import { createLockerValidation } from './validation'
import { LockerAuthers } from './authers'
import { ServiceMethod } from '@/services/ServiceMethod'
import prisma from '@/prisma'
import { ServerError } from '@/services/error'
import { readPageInputSchemaObject } from '@/lib/paging/schema'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import { z } from 'zod'
import type { LockerWithReservation } from '@/services/lockers/Types'

export async function updateLockerReservationIfExpired(locker: LockerWithReservation) {
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
export namespace LockerMethods {
    /**
     * Creates a new locker.
     *
     * @param data - The locker data.
     *
     * @returns The newly created locker object.
     */
    export const create = ServiceMethod({
        auther: () => LockerAuthers.create.dynamicFields({}),
        dataValidation: createLockerValidation,
        method: ({ data }) => prisma.locker.create({
            data,
        })
    })

    /**
     * Reads a locker.
     *
     * @param id - The id of the locker.
     *
     * @returns The locker object.
     */
    export const read = ServiceMethod({
        auther: () => LockerAuthers.read.dynamicFields({}),
        paramsSchema: z.object({
            id: z.number(),
        }),
        method: async ({ params: { id } }) => {
            const locker = await prisma.locker.findUniqueOrThrow({
                where: {
                    id,
                },
                include: lockerReservationIncluder
            })

            await updateLockerReservationIfExpired(locker)

            return locker
        }
    })

    /**
     * Reads a page of lockers.
     *
     * @param paging - The paging data.
     *
     * @returns A list of locker objects.
     */
    export const readPage = ServiceMethod({
        auther: () => LockerAuthers.readPage.dynamicFields({}),
        paramsSchema: readPageInputSchemaObject(
            z.number(),
            z.object({
                id: z.number(),
            }),
            z.undefined(),
        ),
        method: async ({ params }) => {
            const lockers = await prisma.locker.findMany({
                ...cursorPageingSelection(params.paging.page),
                orderBy: {
                    id: 'asc'
                },
                include: lockerReservationIncluder,
            })

            for (const locker of lockers) {
                await updateLockerReservationIfExpired(locker)
            }

            return lockers
        }
    })
}
