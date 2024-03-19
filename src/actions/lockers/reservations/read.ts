'use server'
import prisma from '@/prisma'
import { createPrismaActionError } from '@/actions/error'
import type { LockerReservation } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'

export default async function readLockerReservations(): Promise<ActionReturn<LockerReservation[]>> {
    try {
        const lockerReservations = await prisma.lockerReservation.findMany({

        })
        return {success: true, data: lockerReservations}
    } catch (e) {
        return createPrismaActionError(e)
    }
}