
import 'server-only'
import prisma from '@/prisma'
import { prismaCall } from '@/server/prismaCall'


export async function readLockerReservation(id: number) {
    return await prismaCall(() => prisma.lockerReservation.findUnique({
        where: {
            id
        },
    }))
}
