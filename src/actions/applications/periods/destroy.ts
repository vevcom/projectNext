'use server'
import { ApplicationPeriodMethods } from '@/services/applications/periods/methods'
import { action } from '@/actions/action'

export const destroyApplicationPeriodAction = action(ApplicationPeriodMethods.destroy)
export const removeAllApplicationTextsAction = action(ApplicationPeriodMethods.removeAllApplicationTexts)
