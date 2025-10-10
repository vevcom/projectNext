'use server'

import { action } from '@/services/action'
import { eventRegistrationMethods } from '@/services/events/registration/methods'

export const createEventRegistrationAction = action(eventRegistrationMethods.create)
export const createGuestEventRegistrationAction = action(eventRegistrationMethods.createGuest)
export const readManyEventRegistrationAction = action(eventRegistrationMethods.readMany)
export const eventRegistrationReadManyDetailedAction = action(eventRegistrationMethods.readManyDetailed)
export const eventRegistrationUpdateNotesAction = action(eventRegistrationMethods.updateNotes)
export const eventRegistrationDestroyAction = action(eventRegistrationMethods.destroy)
