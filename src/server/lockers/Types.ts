import type { Prisma } from '@prisma/client'
import { readLocker } from './read'

export type LockerWithReservation = Prisma.PromiseReturnType<typeof readLocker>

export type LockerCursor = {
    id: number
} 
