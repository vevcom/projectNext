import type { lockerReservationIncluder } from './reservations/constants'
import type { Prisma } from '@/prisma-generated-pn-types'

export type LockerWithReservation = Prisma.LockerGetPayload<{
    include: typeof lockerReservationIncluder,
}>

export type LockerCursor = {
    id: number
}
