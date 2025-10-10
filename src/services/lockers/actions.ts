'use server'

import { action } from '@/services/action'
import { lockerLocationOperations } from '@/services/lockers/locations/operations'
import { lockerOperations } from '@/services/lockers/operations'
import { lockerReservationOperations } from '@/services/lockers/reservations/operations'

export const createLockerLocationAction = action(lockerLocationOperations.create)
export const readAllLockerLocationsAction = action(lockerLocationOperations.readAll)

export const createLockerAction = action(lockerOperations.create)
export const readLockerAction = action(lockerOperations.read)
export const readLockerPageAction = action(lockerOperations.readPage)

export const updateLockerReservationAction = action(lockerReservationOperations.update)
export const createLockerReservationAction = action(lockerReservationOperations.create)
