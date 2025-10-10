'use server'

import { action } from '@/services/action'
import { licenseOperations } from '@/services/licenses/operations'

export const createLicenseAction = action(licenseOperations.create)

export const destroyLicenseAction = action(licenseOperations.destroy)

export const readAllLicensesAction = action(licenseOperations.readAll)

export const updateLicenseAction = action(licenseOperations.update)
