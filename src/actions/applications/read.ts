'use server'
import { action } from '@/actions/action'
import { ApplicationMethods } from '@/services/applications/methods'

export const readApplicationsForUserAction = action(ApplicationMethods.readForUser)
