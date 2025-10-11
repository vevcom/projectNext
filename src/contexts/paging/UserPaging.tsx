'use client'
import { generatePagingProvider, generatePagingContext } from './PagingGenerator'
import { readUserPageAction } from '@/services/users/actions'
import type { UserDetails, UserPagingReturn, UserCursor } from '@/services/users/types'

export type PageSizeUsers = 50;

export const UserPagingContext = generatePagingContext<UserPagingReturn, UserCursor, PageSizeUsers, UserDetails>()

export const UserPagingProvider = generatePagingProvider({
    Context: UserPagingContext,
    fetcher: async ({ paging }) => await readUserPageAction({ paging }),
    getCursor: ({ lastElement }) => ({ id: lastElement.id }),
})
