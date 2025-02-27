'use server'

import { action } from '@/actions/action'
import { LockerReservationMethods } from '@/services/lockers/reservations/methods'

export const updateLockerReservationAction = action(LockerReservationMethods.update)
