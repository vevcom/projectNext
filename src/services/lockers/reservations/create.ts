import 'server-only'
import { createLockerReservationValidation } from '@/services/lockers/reservations/validation'
import prisma from '@/prisma'
import { prismaCall } from '@/services/prismaCall'
import type { CreateLockerReservationTypes } from '@/services/lockers/reservations/validation'
import type { LockerReservation } from '@prisma/client'


export async function createLockerReservation(
    userId: number,
    lockerId: number,
    rawdata: CreateLockerReservationTypes['Detailed']
): Promise<LockerReservation> {
    const data = createLockerReservationValidation.detailedValidate(rawdata)
    return await prismaCall(() => prisma.lockerReservation.create({
        data: {
            groupId: data.groupId,
            endDate: data.endDate,
            userId,
            lockerId
        }
    }))
}

