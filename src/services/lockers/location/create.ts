import { createLockerLocationValidation } from './validation'
import prisma from '@/prisma'
import type { CreateLockerLocationTypes } from './validation'
import { prismaCall } from '@/services/prismaCall'

export async function createLockerLocation(rawdata: CreateLockerLocationTypes['Detailed']) {
    const data = createLockerLocationValidation.detailedValidate(rawdata)
    return await prismaCall(() => prisma.lockerLocation.create({
        data: {
            building: data.building,
            floor: data.floor
        }
    }))
}
