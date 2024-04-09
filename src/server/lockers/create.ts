import 'server-only'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import { CreateLockerTypes, createLockerValidation } from './validation'

export async function createLocker(rawdata: CreateLockerTypes['Detailed']) {
    const data = createLockerValidation.detailedValidate(rawdata)
    return prismaCall(() => prisma.locker.create({
        data: {
            building: data.location,
            floor: 1
        }
    }))
}