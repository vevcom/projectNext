'use server'
import { action } from '@/actions/action'
import { LicenseMethods } from '@/services/licenses/methods'

export const readAllLicensesAction = action(LicenseMethods.readAll)
