'use server'

import { action } from '@/services/action'
import { eventRegistrationOperations } from '@/services/events/registration/operations'

export const createEventRegistrationAction = action(eventRegistrationOperations.create)
export const createGuestEventRegistrationAction = action(eventRegistrationOperations.createGuest)
export const readManyEventRegistrationAction = action(eventRegistrationOperations.readMany)
export const eventRegistrationReadManyDetailedAction = action(eventRegistrationOperations.readManyDetailed)
export const eventRegistrationUpdateNotesAction = action(eventRegistrationOperations.updateNotes)
export const eventRegistrationDestroyAction = action(eventRegistrationOperations.destroy)
