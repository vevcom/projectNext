'use server'
import { LicenseMethods } from '@/services/licenses/methods'
import { action } from '@/actions/action'

export const updateLicenseAction = action(LicenseMethods.update)
