import { createLockerLocationValidation } from './validation'
import prisma from '@/prisma'
import { prismaCall } from '@/services/prismaCall'
import type { CreateLockerLocationTypes } from './validation'

export async function createLockerLocation(rawdata: CreateLockerLocationTypes['Detailed']) {
    const data = createLockerLocationValidation.detailedValidate(rawdata)
    return await prismaCall(() => prisma.lockerLocation.create({
        data: {
            building: data.building,
            floor: data.floor
        }
    }))
}
