import type { lockerReservationIncluder } from './reservations/config'
import type { Prisma } from '@prisma/client'

export type LockerWithReservation = Prisma.LockerGetPayload<{
    include: typeof lockerReservationIncluder,
}>

export type LockerCursor = {
    id: number
}
