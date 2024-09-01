import prisma from '@/prisma'
import { prismaCall } from '@/services/prismaCall'

export async function readLockerLocations() {
    const lockerLocations = await prismaCall(() => prisma.lockerLocation.findMany({
        select: {
            building: true,
            floor: true
        }
    }))
    return lockerLocations
}
