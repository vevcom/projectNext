'use server'

import { applicationMethods } from './methods'
import { action } from '@/services/action'

export const createApplicationAction = action(applicationMethods.create)

export const destroyApplicationAction = action(applicationMethods.destroy)

export const readApplicationsForUserAction = action(applicationMethods.readForUser)

export const updateApplicationAction = action(applicationMethods.update)
