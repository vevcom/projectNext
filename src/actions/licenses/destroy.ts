'use server'

import { action } from '@/actions/action'
import { destroyLicense } from '@/services/licenses/destroy'

export const destroyLicenseAction = action(destroyLicense)
