'use server'

import { updateLicense } from '@/services/licenses/update'
import { action } from '@/actions/action'

export const updateLicenseAction = action(updateLicense)
