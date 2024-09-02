import 'server-only'
import { lockerReservationValidation } from '@/services/lockers/reservations/validation'
import prisma from '@/prisma'
import { prismaCall } from '@/services/prismaCall'
import type { LockerReservationValidationTypes } from '@/services/lockers/reservations/validation'
import type { LockerReservation } from '@prisma/client'


export async function createLockerReservation(
    userId: number,
    lockerId: number,
    rawdata: LockerReservationValidationTypes['Detailed']
): Promise<LockerReservation> {
    const data = lockerReservationValidation.detailedValidate(rawdata)
    return await prismaCall(() => prisma.lockerReservation.create({
        data: {
            groupId: data.groupId,
            endDate: data.endDate,
            userId,
            lockerId
        }
    }))
}

