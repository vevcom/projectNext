import type { Locker } from '@prisma/client'

export type LockerWithReservation = Locker & {
    LockerReservation: {
        id: number,
        user: {
            id: number
            firstname: string
            lastname: string
        },
        endDate: Date | null
    }[]
}