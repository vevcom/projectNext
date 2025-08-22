'use server'

import { action } from '@/actions/action'
import { EventRegistrationMethods } from '@/services/events/registration/methods'

export const createEventRegistrationAction = action(EventRegistrationMethods.create)
export const createGuestEventRegistrationAction = action(EventRegistrationMethods.createGuest)
export const readManyEventRegistrationAction = action(EventRegistrationMethods.readMany)
export const eventRegistrationReadManyDetailedAction = action(EventRegistrationMethods.readManyDetailed)
export const eventRegistrationUpdateNotesAction = action(EventRegistrationMethods.updateNotes)
export const eventRegistrationDestroyAction = action(EventRegistrationMethods.destroy)
