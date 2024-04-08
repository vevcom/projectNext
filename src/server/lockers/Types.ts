import type { Locker } from '@prisma/client'

export type LockerWithReservation = Locker & {
    LockerReservation: {
        id: number,
        endDate: Date | null,
        group: {
            id: number
        } | null,
        user: {
            id: number
            firstname: string
            lastname: string
        }
    }[]
}