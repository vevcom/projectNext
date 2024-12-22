'use server'

import { ActionNoData } from '@/actions/Action'
import { Licenses } from '@/services/licenses'


export const readLicensesAction = ActionNoData(Licenses.readAll)
