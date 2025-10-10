'use server'

import { action } from '@/services/action'
import { licenseMethods } from '@/services/licenses/methods'

export const createLicenseAction = action(licenseMethods.create)

export const destroyLicenseAction = action(licenseMethods.destroy)

export const readAllLicensesAction = action(licenseMethods.readAll)

export const updateLicenseAction = action(licenseMethods.update)
