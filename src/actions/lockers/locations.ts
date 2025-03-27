'use server'

import { action } from '@/actions/action'
import { LockerLocationMethods } from '@/services/lockers/locations/methods'

export const createLockerLocationAction = action(LockerLocationMethods.create)
export const readAllLockerLocationsAction = action(LockerLocationMethods.readAll)
