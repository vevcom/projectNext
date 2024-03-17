import prisma from '@/prisma'
import { createPrismaActionError } from '@/actions/error'
import type { LockerResorvation } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'

export default async function readLockerResorvations(): Promise<ActionReturn<LockerResorvation[]>> {
    try {
        const lockersResorvations = await prisma.lockerResorvation.findMany({
           include: {
            user: true
           } 
        })
        return {success: true, data: lockersResorvations}
    } catch (e) {
        return createPrismaActionError(e)
    }
}