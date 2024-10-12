import 'server-only'
import { lockerReservationValidation } from './validation'
import prisma from '@/prisma'
import { prismaCall } from '@/services/prismaCall'
import type { LockerReservationValidationTypes } from './validation'


export async function updateLockerReservation(id: number, rawData: LockerReservationValidationTypes['Detailed']) {
    const data = lockerReservationValidation.detailedValidate(rawData)
    return await prismaCall(() => prisma.lockerReservation.update({
        where: {
            id
        },
        data: {
            groupId: data.groupId,
            endDate: data.endDate,
        }
    }))
}
