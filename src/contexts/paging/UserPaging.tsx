'use client'
import generatePagingProvider, { generatePagingContext } from './PagingGenerator'
import { readUserPageAction } from '@/services/users/actions'
import type { ReadPageInput } from '@/lib/paging/types'
import type { UserDetails, UserPagingReturn, UserCursor } from '@/services/users/types'

export type PageSizeUsers = 50;
const fetcher = async (x: ReadPageInput<PageSizeUsers, UserCursor, UserDetails>) => {
    const users = await readUserPageAction({
        paging: x
    })
    return users
}

export const UserPagingContext = generatePagingContext<UserPagingReturn, UserCursor, PageSizeUsers, UserDetails>()
const UserPagingProvider = generatePagingProvider({
    Context: UserPagingContext,
    fetcher,
    getCursorAfterFetch: data => (data.length ? { id: data[data.length - 1].id } : null),
})
export default UserPagingProvider
