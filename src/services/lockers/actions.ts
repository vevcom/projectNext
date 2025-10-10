'use server'

import { action } from '@/services/action'
import { lockerLocationMethods } from '@/services/lockers/locations/methods'
import { lockerMethods } from '@/services/lockers/methods'
import { lockerReservationMethods } from '@/services/lockers/reservations/methods'

export const createLockerLocationAction = action(lockerLocationMethods.create)
export const readAllLockerLocationsAction = action(lockerLocationMethods.readAll)

export const createLockerAction = action(lockerMethods.create)
export const readLockerAction = action(lockerMethods.read)
export const readLockerPageAction = action(lockerMethods.readPage)

export const updateLockerReservationAction = action(lockerReservationMethods.update)
export const createLockerReservationAction = action(lockerReservationMethods.create)
