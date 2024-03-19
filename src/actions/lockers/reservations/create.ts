'use server'
import { lockerReservationSchema } from './schema'
import prisma from '@/prisma'
import { createActionError, createPrismaActionError, createZodActionError } from '@/actions/error'
import { getUser } from '@/auth/user'
// import type { OmegaquotesSchemaType } from './schema'
import type { ActionReturn } from '@/actions/Types'
import type { LockerReservation } from '@prisma/client'

export async function createLockerResorvation(rawdata: FormData): Promise<ActionReturn<LockerReservation>> {

    const parse = lockerReservationSchema.safeParse(rawdata)

    if (!parse.success) {
        return createZodActionError(parse)
    }

    const { lockerId, userId } = parse.data

    try {
        const results = await prisma.lockerReservation.create({
            data: {
                lockerId,
                userId
            }
        })

        return { success: true, data: results }
    } catch (error) {
        return createPrismaActionError(error)
    }
}