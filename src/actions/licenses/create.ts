'use server'
import { action } from '@/actions/action'
import { createLicense } from '@/services/licenses/create'

export const createLicenseAction = action(createLicense)
