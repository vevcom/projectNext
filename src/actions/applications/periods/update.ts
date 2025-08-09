'use server'
import { ApplicationPeriodMethods } from '@/services/applications/periods/methods'
import { action } from '@/actions/action'

export const updateApplicationPeriodAction = action(ApplicationPeriodMethods.update)
