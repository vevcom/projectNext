'use server'
import { ActionNoData } from '@/actions/Action'
import { Licenses } from '@/services/licenses'

export const destroyLicenseAction = ActionNoData(Licenses.destroy)
