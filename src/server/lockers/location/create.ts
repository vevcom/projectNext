import prisma from '@/prisma'
import { prismaCall } from '@/server/prismaCall'

export async function createLockerLocation() {
    return await prismaCall(() => prisma.lockerLocation.create({
        data: {
            building: "test",
            floor: 1
        }
    }))
}
