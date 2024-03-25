'use server'
import { lockerReservationSchema } from './schema'
import prisma from '@/prisma'
import { createActionError, createZodActionError } from '@/actions/error'
import type { ActionReturn } from '@/actions/Types'
import type { LockerReservation } from '@prisma/client'

export async function createLockerResorvation(rawdata: FormData): Promise<ActionReturn<LockerReservation>> {

    const parse = lockerReservationSchema.safeParse(rawdata)

    if (!parse.success) {
        return createZodActionError(parse)
    }

    const { lockerId, userId } = parse.data

    try {
        const result = await prisma.lockerReservation.create({
            data: {
                lockerId,
                userId,
            }
        })

        return { success: true, data: result }
    } catch (error) {
        return createPrismaActionError(error)
    }
}