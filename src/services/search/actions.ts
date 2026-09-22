'use server'
import { makeAction } from '@/services/serverAction'
import { searchOperations } from '@/services/search/operations'

export const searchUsersAction = makeAction(searchOperations.searchUsers)
export const searchEventsAction = makeAction(searchOperations.searchEvents)
