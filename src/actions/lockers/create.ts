'use server'
import { LockerMethods } from '@/services/lockers/methods'
import { action } from '@/actions/action'

export const createLockerAction = action(LockerMethods.create)
