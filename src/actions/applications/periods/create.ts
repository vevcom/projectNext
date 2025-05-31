'use server'
import { action } from '@/actions/action'
import { ApplicationPeriodMethods } from '@/services/applications/periods/methods'

export const createApplicationPeriodAction = action(ApplicationPeriodMethods.create)
