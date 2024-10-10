import type { readLocker } from './read'
import type { Prisma } from '@prisma/client'

export type LockerWithReservation = Prisma.PromiseReturnType<typeof readLocker>

export type LockerCursor = {
    id: number
}
