'use server'

import { action } from '@/actions/action'
import { ApplicationMethods } from '@/services/applications/methods'

export const createApplicationAction = action(ApplicationMethods.create)

export const destroyApplicationAction = action(ApplicationMethods.destroy)

export const readApplicationsForUserAction = action(ApplicationMethods.readForUser)

export const updateApplicationAction = action(ApplicationMethods.update)
