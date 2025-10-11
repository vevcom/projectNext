'use server'

import { applicationOperations } from './operations'
import { makeAction } from '@/services/serverAction'

export const createApplicationAction = makeAction(applicationOperations.create)

export const destroyApplicationAction = makeAction(applicationOperations.destroy)

export const readApplicationsForUserAction = makeAction(applicationOperations.readForUser)

export const updateApplicationAction = makeAction(applicationOperations.update)
