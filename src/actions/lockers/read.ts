'use server'
import { action } from '@/actions/action'
import { LockerMethods } from '@/services/lockers/methods'

/**
 * An action to read a locker, including it´s active reservation.
 * If reservation is expired it will be set to unactive and not returned with the locker
 * @param id - The id of the locker
 * @returns A Promise that resolves to an ActionReturn containing a LockerWithReservation
 */
export const readLockerAction = action(LockerMethods.read)

/**
 * An action to read a page of lockers, including their active reservations.
 * Expired reservations will be set to unactive while fetching them
 * @param readPageInput - The page data
 * @returns A Promise that resolves to an ActionReturn containing a LockerWithReservation list
 */
export const readLockerPageAction = action(LockerMethods.read)
