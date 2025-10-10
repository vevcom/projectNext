'use server'

import { makeAction } from '@/services/serverAction'
import { eventRegistrationOperations } from '@/services/events/registration/operations'

export const createEventRegistrationAction = makeAction(eventRegistrationOperations.create)
export const createGuestEventRegistrationAction = makeAction(eventRegistrationOperations.createGuest)
export const readManyEventRegistrationAction = makeAction(eventRegistrationOperations.readMany)
export const eventRegistrationReadManyDetailedAction = makeAction(eventRegistrationOperations.readManyDetailed)
export const eventRegistrationUpdateNotesAction = makeAction(eventRegistrationOperations.updateNotes)
export const eventRegistrationDestroyAction = makeAction(eventRegistrationOperations.destroy)
