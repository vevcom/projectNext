'use server'

import { makeAction } from '@/services/serverAction'
import { licenseOperations } from '@/services/licenses/operations'

export const createLicenseAction = makeAction(licenseOperations.create)

export const destroyLicenseAction = makeAction(licenseOperations.destroy)

export const readAllLicensesAction = makeAction(licenseOperations.readAll)

export const updateLicenseAction = makeAction(licenseOperations.update)
