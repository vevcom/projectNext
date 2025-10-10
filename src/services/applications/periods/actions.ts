'use server'

import { action } from '@/services/action'
import { applicationPeriodOperations } from '@/services/applications/periods/operations'

export const createApplicationPeriodAction = action(applicationPeriodOperations.create)

export const destroyApplicationPeriodAction = action(applicationPeriodOperations.destroy)
export const removeAllApplicationTextsAction = action(applicationPeriodOperations.removeAllApplicationTexts)

export const readApplicationPeriodsAction = action(applicationPeriodOperations.readAll)
export const readApplicationPeriodAction = action(applicationPeriodOperations.read)
export const readNumberOfApplicationsAction = action(applicationPeriodOperations.readNumberOfApplications)

export const updateApplicationPeriodAction = action(applicationPeriodOperations.update)
