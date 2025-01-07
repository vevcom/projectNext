'use server'
import { Action } from '@/actions/Action'
import { readDotsPage, readDotWrappersForUser } from '@/services/dots/read'

export const readDotPageAction = Action(readDotsPage)

export const readDotWrappersForUserAction = Action(readDotWrappersForUser)
