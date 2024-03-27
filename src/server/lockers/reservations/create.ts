import 'server-only'
import { createLockerReservationValidation } from '@/server/lockers/reservations/validation'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { CreateLockerReservationTypes } from '@/server/lockers/reservations/validation'
import type { LockerReservation } from '@prisma/client'

/**
 * A function to create a locker reservation
 * @param userId - The user id of the user creating the reservation
 * @param data - The data of the reservation to be created
 * @returns
 */
export async function createLockerReservation(
    userId: number,
    lockerId: number,
    data: CreateLockerReservationTypes['Detailed']
): Promise<LockerReservation> {
    // const data = createLockerReservationValidation.detailedValidate(rawdata)
    if (data.committeeId == -1) {
        delete (data as any).committeeId
    }
    return await prismaCall(() => prisma.lockerReservation.create({
        data: {
            ...data,
            userId,
            lockerId
        }
    }))
}

