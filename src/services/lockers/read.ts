import 'server-only'
import { lockerReservationIncluder } from './reservations/ConfigVars'
import prisma from '@/prisma'
import { createActionError } from '@/actions/error'
import type { ReadPageInput } from '@/services/paging/Types'
import type { LockerWithReservation, LockerCursor } from '@/services/lockers/Types'
import { ServerError } from '@/services/error'
import { prismaCall } from '@/services/prismaCall'

export async function readLocker(id: number) {
    const locker = await prismaCall(() => prisma.locker.findUnique({
        where: {
            id
        },
        include: lockerReservationIncluder
    }))
    if (!locker) throw new ServerError('NOT FOUND', `locker ${id} not found`)
    return locker
}


export async function readLockerPage<const PageSize extends number>(
    { page }: ReadPageInput<PageSize, LockerCursor>
): Promise<LockerWithReservation[]> {
    const { page: pageNumber, pageSize } = page
    return await prismaCall(() => prisma.locker.findMany({
        orderBy: {
            id: 'asc'
        },
        skip: pageNumber * pageSize,
        take: pageSize,
        include: lockerReservationIncluder
    }))
}


export async function updateLockerReservationIfExpired(locker: LockerWithReservation) {
    if (!locker.LockerReservation.length) return

    const reservation = locker.LockerReservation[0]

    if (reservation.endDate === null) return
    if (reservation.endDate.getTime() < Date.now()) {
        try {
            const updateResult = await prisma.lockerReservation.update({
                where: {
                    id: locker.LockerReservation[0].id
                },
                data: {
                    active: false
                }
            })
            if (!updateResult) {
                createActionError('NOT FOUND', 'lockerReservation not found while updating')
            }
            locker.LockerReservation = []
        } catch (error) {
            if (error instanceof ServerError) {
                createActionError(error.errorCode, error.errors)
            }
            createActionError('UNKNOWN ERROR', 'unknown error while updating expired locker')
        }
    }
}
