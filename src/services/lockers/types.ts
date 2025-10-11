import type { lockerReservationIncluder } from './reservations/constants'
import type { Prisma } from '@prisma/client'

export type LockerWithReservation = Prisma.LockerGetPayload<{
    include: typeof lockerReservationIncluder,
}>

export type LockerCursor = {
    id: number
}
