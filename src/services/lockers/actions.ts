'use server'

import { action } from '@/actions/action'
import { LockerLocationMethods } from '@/services/lockers/locations/methods'
import { LockerMethods } from '@/services/lockers/methods'
import { LockerReservationMethods } from '@/services/lockers/reservations/methods'

export const createLockerLocationAction = action(LockerLocationMethods.create)
export const readAllLockerLocationsAction = action(LockerLocationMethods.readAll)

export const createLockerAction = action(LockerMethods.create)
export const readLockerAction = action(LockerMethods.read)
export const readLockerPageAction = action(LockerMethods.readPage)

export const updateLockerReservationAction = action(LockerReservationMethods.update)
export const createLockerReservationAction = action(LockerReservationMethods.create)
