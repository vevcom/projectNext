'use server'

import { action } from '@/services/action'
import { ApplicationPeriodMethods } from '@/services/applications/periods/methods'

export const createApplicationPeriodAction = action(ApplicationPeriodMethods.create)

export const destroyApplicationPeriodAction = action(ApplicationPeriodMethods.destroy)
export const removeAllApplicationTextsAction = action(ApplicationPeriodMethods.removeAllApplicationTexts)

export const readApplicationPeriodsAction = action(ApplicationPeriodMethods.readAll)
export const readApplicationPeriodAction = action(ApplicationPeriodMethods.read)
export const readNumberOfApplicationsAction = action(ApplicationPeriodMethods.readNumberOfApplications)

export const updateApplicationPeriodAction = action(ApplicationPeriodMethods.update)
