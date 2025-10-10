'use server'

import { applicationOperations } from './operations'
import { action } from '@/services/action'

export const createApplicationAction = action(applicationOperations.create)

export const destroyApplicationAction = action(applicationOperations.destroy)

export const readApplicationsForUserAction = action(applicationOperations.readForUser)

export const updateApplicationAction = action(applicationOperations.update)
