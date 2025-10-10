'use server'

import { action } from '@/services/action'
import { applicationPeriodMethods } from '@/services/applications/periods/methods'

export const createApplicationPeriodAction = action(applicationPeriodMethods.create)

export const destroyApplicationPeriodAction = action(applicationPeriodMethods.destroy)
export const removeAllApplicationTextsAction = action(applicationPeriodMethods.removeAllApplicationTexts)

export const readApplicationPeriodsAction = action(applicationPeriodMethods.readAll)
export const readApplicationPeriodAction = action(applicationPeriodMethods.read)
export const readNumberOfApplicationsAction = action(applicationPeriodMethods.readNumberOfApplications)

export const updateApplicationPeriodAction = action(applicationPeriodMethods.update)
