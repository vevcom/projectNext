import 'server-only'
import { createLockerValidation } from './validation'
import prisma from '@/prisma'
import { prismaCall } from '@/services/prismaCall'
import type { CreateLockerTypes } from './validation'

export async function createLocker(rawdata: CreateLockerTypes['Detailed']) {
    const data = createLockerValidation.detailedValidate(rawdata)
    return prismaCall(() => prisma.locker.create({
        data: {
            building: data.building,
            floor: data.floor,
            id: data.id
        }
    }))
}
