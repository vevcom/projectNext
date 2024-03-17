import prisma from '@/prisma'
import { createPrismaActionError } from '@/actions/error'
import type { Locker, LockerResorvation } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'

// type LockerWithReservation = Locker & {
//     LockerResorvation: LockerResorvation[]
// }

// export default async function readLockers(): Promise<ActionReturn<LockerWithReservation[]>> {
export default async function readLockers() {
    try {
        const lockers = await prisma.locker.findMany({
           include: {
            LockerResorvation: {
                select: {
                    user: {
                        select: {
                            firstname: true,
                            lastname: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                },
                take: 1
            }
           } 
        })
        return {success: true, data: lockers}
    } catch (e) {
        return createPrismaActionError(e)
    }
}