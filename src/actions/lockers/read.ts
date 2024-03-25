'use server'
import prisma from '@/prisma'
import { createActionError } from '@/actions/error'
import { ServerError } from '@/server/error'
import type { ActionReturn, ReadPageInput } from '@/actions/Types'
import type { LockerWithReservation } from './Types'


export async function readLocker(id: number): Promise<ActionReturn<LockerWithReservation>> {
// export async function readLocker(id: number) {
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
        return {success: true, data: locker}
    } catch (error) {
        if (error instanceof ServerError) {
            return createActionError(error.errorCode, error.errors)
        }
        return createActionError("UNKNOWN ERROR", "unknown error from readLockers")
    }
}


export async function readLockers(): Promise<ActionReturn<LockerWithReservation[]>> {
    try {
        const lockers = await prisma.locker.findMany({
            orderBy: {
                id: "asc"
            },
            include: {
                LockerReservation: {
                    where: {
                        active: true
                    },
                    select: {
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
        return {success: true, data: lockers}
    } catch (error) {
        if (error instanceof ServerError) {
            return createActionError(error.errorCode, error.errors)
        }
        return createActionError("UNKNOWN ERROR", "unknown error from readLockers")
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
        return {success: true, data: lockers}
    } catch (error) {
        if (error instanceof ServerError) {
            return createActionError(error.errorCode, error.errors)
        }
        return createActionError('UNKNOWN ERROR', 'unknown error from readLockerPage')
    }
}