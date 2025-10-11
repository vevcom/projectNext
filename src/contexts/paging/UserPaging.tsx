'use client'
import { generatePaging } from './PagingGenerator'
import { readUserPageAction } from '@/services/users/actions'
import type { UserDetails, UserPagingReturn, UserCursor } from '@/services/users/types'

export type PageSizeUsers = 50;

export const [UserPagingContext, UserPagingProvider] = generatePaging<
    UserPagingReturn,
    UserCursor,
    PageSizeUsers,
    UserDetails
>({
    fetcher: async ({ paging }) => await readUserPageAction({ paging }),
    getCursor: ({ lastElement }) => ({ id: lastElement.id }),
})
