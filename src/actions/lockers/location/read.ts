import { action } from '@/actions/action'
import { LockerLocationMethods } from '@/services/lockers/locations/methods'

export const readAllLockerLocationsAction = action(LockerLocationMethods.readAll)
