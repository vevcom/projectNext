import prisma from '@/prisma'
import { prismaCall } from '@/server/prismaCall'
import { CreateLockerLocationTypes, createLockerLocationValidation } from './validation'

export async function createLockerLocation( rawdata: CreateLockerLocationTypes['Detailed'] ) {
    const data = createLockerLocationValidation.detailedValidate(rawdata)
    return await prismaCall(() => prisma.lockerLocation.create({
        data: {
            building: data.building,
            floor: data.floor
        }
    }))
}
