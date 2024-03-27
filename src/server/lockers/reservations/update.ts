import 'server-only'
import prisma from '@/prisma'
import { prismaCall } from '@/server/prismaCall'
import { updateLockerReservationValidation } from './validation'
import { UpdateLockerReservationTypes } from './validation'

/**
 * A function to update a locker reservation
 * @param id - The id of the reservation to be updated
 * @param data - The data to be updated
 * @returns
 */
export async function updateLockerReservation(id: number, data: UpdateLockerReservationTypes['Detailed']) {
    // const data = updateLockerReservationValidation.detailedValidate(rawData)
    if (data.committeeId == -1) {
        delete (data as any).committeeId
    }

    return await prismaCall(() => prisma.lockerReservation.update({
        where: {
            id
        },
        data
    }))
}