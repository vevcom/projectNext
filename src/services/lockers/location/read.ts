import { lockerLocationSelector } from './ConfigVars'
import prisma from '@/prisma'
import { prismaCall } from '@/services/prismaCall'

export async function readLockerLocations() {
    const lockerLocations = await prismaCall(() => prisma.lockerLocation.findMany(lockerLocationSelector))
    return lockerLocations
}
