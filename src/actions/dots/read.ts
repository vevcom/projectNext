'use server'
import { action } from '@/actions/action'
import { readDotsPage, readDotWrappersForUser } from '@/services/dots/read'

export const readDotPageAction = action(readDotsPage)

export const readDotWrappersForUserAction = action(readDotWrappersForUser)
