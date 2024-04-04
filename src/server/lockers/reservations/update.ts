import 'server-only'
import prisma from '@/prisma'
import { prismaCall } from '@/server/prismaCall'
import { updateLockerReservationValidation } from './validation'
import { UpdateLockerReservationTypes } from './validation'


export async function updateLockerReservation(id: number, rawData: UpdateLockerReservationTypes['Detailed']) {
    const data = updateLockerReservationValidation.detailedValidate(rawData)
    if (data.committeeId == -1) {
        delete (data as any).committeeId
    }
    delete (data as any).indefinateDate
    return await prismaCall(() => prisma.lockerReservation.update({
        where: {
            id
        },
        data
    }))
}