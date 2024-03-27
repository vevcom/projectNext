import 'server-only'
import prisma from '@/prisma'
import { createActionError } from '@/actions/error'
import { ServerError } from '@/server/error'
import { prismaCall } from '@/server/prismaCall'
import type { ReadPageInput } from '@/actions/Types'
import type { LockerWithReservation } from '@/server/lockers/Types'


export async function readLocker(id: number): Promise<LockerWithReservation> {
    const locker = await prismaCall(() => prisma.locker.findUnique({
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
                            id: true,
                            firstname: true,
                            lastname: true
                        }
                    },
                    endDate: true
                }
            }
        } 
    }))
    if (!locker) throw new ServerError('NOT FOUND', `locker ${id} not found`)
    return locker
}


export async function readLockerPage<const PageSize extends number>(
    { page }: ReadPageInput<PageSize>
): Promise<LockerWithReservation[]> {
    const { page: pageNumber, pageSize } = page
    return await prismaCall(() => prisma.locker.findMany({
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
                            id: true,
                            firstname: true,
                            lastname: true
                        }
                    },
                    endDate: true
                }
            }
        } 
    }))        
}


export async function updateLockerReservationIfExpired(locker: LockerWithReservation) {
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