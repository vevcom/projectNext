'use server'
import { LockerMethods } from '@/services/lockers/methods'
import { action } from '@/actions/action'

export const createLockerAction = action(LockerMethods.create)
export const readLockerAction = action(LockerMethods.read)
export const readLockerPageAction = action(LockerMethods.readPage)
