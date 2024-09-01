import 'server-only'
import { updateLockerReservationValidation } from './validation'
import prisma from '@/prisma'
import type { UpdateLockerReservationTypes } from './validation'
import { prismaCall } from '@/services/prismaCall'


export async function updateLockerReservation(id: number, rawData: UpdateLockerReservationTypes['Detailed']) {
    const data = updateLockerReservationValidation.detailedValidate(rawData)
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
