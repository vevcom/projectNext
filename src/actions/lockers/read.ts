import prisma from '@/prisma'
import { createPrismaActionError } from '@/actions/error'
import type { Locker } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'

export default async function readLockers(): Promise<ActionReturn<Locker[]>> {
    try {
        const lockers = await prisma.locker.findMany({
            
        })
        return {success: true, data: lockers}
    } catch (e) {
        return createPrismaActionError(e)
    }
}