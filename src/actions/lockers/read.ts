'use server'
import prisma from '@/prisma'
import { createPrismaActionError } from '@/actions/error'
import type { ActionReturn, ReadPageInput } from '@/actions/Types'
import type { LockerWithReservation } from './Types'

export async function readLockers(): Promise<ActionReturn<LockerWithReservation[]>> {
    try {
        const lockers = await prisma.locker.findMany({
            orderBy: {
                id: "asc"
            },
            include: {
                LockerReservation: {
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