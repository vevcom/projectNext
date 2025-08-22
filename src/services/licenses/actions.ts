'use server'

import { action } from '@/services/action'
import { LicenseMethods } from '@/services/licenses/methods'

export const createLicenseAction = action(LicenseMethods.create)

export const destroyLicenseAction = action(LicenseMethods.destroy)

export const readAllLicensesAction = action(LicenseMethods.readAll)

export const updateLicenseAction = action(LicenseMethods.update)
