'use server'
import { ApplicationMethods } from '@/services/applications/methods'
import { action } from '@/actions/action'

export const updateApplicationAction = action(ApplicationMethods.update)
