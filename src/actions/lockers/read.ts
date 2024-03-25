'use server'
import prisma from '@/prisma'
import { createActionError } from '@/actions/error'
import { ServerError } from '@/server/error'
import type { ActionReturn, ReadPageInput } from '@/actions/Types'
import type { LockerWithReservation } from './Types'


export async function readLocker(id: number): Promise<ActionReturn<LockerWithReservation>> {
    try {
        const locker = await prisma.locker.findUnique({
            where: {
                id
            },
            include: {
                LockerReservation: {
                    where: {
                        active: true
                    },
                    select: {
                        id: true,
                        user: {
                            select: {
                                firstname: true,
                                lastname: true
                            }
                        },
                        endDate: true
                    }
                }
            } 
        })
        if (!locker) {
            return createActionError("NOT FOUND", "locker not found")
        }

        await updateLockerReservationIfExpired(locker)
        return {success: true, data: locker}
    }
    catch (error) {
        if (error instanceof ServerError) {
            return createActionError(error.errorCode, error.errors)
        }
        return createActionError("UNKNOWN ERROR", "unknown error from readLocker")
    }
}


export async function readLockerPage<const PageSize extends number>(
    { page }: ReadPageInput<PageSize>
): Promise<ActionReturn<LockerWithReservation[]>> {
    try {
        const { page: pageNumber, pageSize } = page
        const lockers = await prisma.locker.findMany({
            orderBy: {
                id: "asc"
            },
            skip: pageNumber * pageSize,
            take: pageSize,
            include: {
                LockerReservation: {
                    where: {
                        active: true
                    },
                    select: {
                        id: true,
                        user: {
                            select: {
                                firstname: true,
                                lastname: true
                            }
                        },
                        endDate: true
                    }
                }
            } 
        })

        for (let locker of lockers) {
            await updateLockerReservationIfExpired(locker)
        }
        return {success: true, data: lockers}
    }
    catch (error) {
        if (error instanceof ServerError) {
            return createActionError(error.errorCode, error.errors)
        }
        return createActionError('UNKNOWN ERROR', 'unknown error from readLockerPage')
    }
}


async function updateLockerReservationIfExpired(locker: LockerWithReservation) {
    if (locker.LockerReservation.length && locker.LockerReservation[0].endDate != null && locker.LockerReservation[0].endDate.getTime() < Date.now()) {
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
                return createActionError("NOT FOUND", "lockerReservation not found while updating") 
            }
            locker.LockerReservation = []
        }
        catch (error) {
            if (error instanceof ServerError) {
                return createActionError(error.errorCode, error.errors)
            }
            return createActionError("UNKNOWN ERROR", "unknown error while updating expired locker")
        }
    }
}