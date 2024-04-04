import 'server-only'
import { createLockerReservationValidation } from '@/server/lockers/reservations/validation'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { CreateLockerReservationTypes } from '@/server/lockers/reservations/validation'
import type { LockerReservation } from '@prisma/client'


export async function createLockerReservation(
    userId: number,
    lockerId: number,
    rawdata: CreateLockerReservationTypes['Detailed']
): Promise<LockerReservation> {
    const data = createLockerReservationValidation.detailedValidate(rawdata)
    if (data.committeeId == -1) {
        delete (data as any).committeeId
    }
    delete (data as any).indefinateDate
    return await prismaCall(() => prisma.lockerReservation.create({
        data: {
            ...data,
            userId,
            lockerId
        }
    }))
}

