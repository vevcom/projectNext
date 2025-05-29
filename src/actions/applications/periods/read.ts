'use server'
import { ApplicationPeriodMethods } from '@/services/applications/periods/methods'
import { action } from '@/actions/action'

export const readApplicationPeriodsAction = action(ApplicationPeriodMethods.readAll)
export const readApplicationPeriodAction = action(ApplicationPeriodMethods.read)
export const readNumberOfApplicationsAction = action(ApplicationPeriodMethods.readNumberOfApplications)
