'use server'

import { readAllLicenses } from '@/services/licenses/read'
import { action } from '@/actions/action'

export const readAllLicensesAction = action(readAllLicenses)
