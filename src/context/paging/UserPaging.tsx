'use client'
import generatePagingProvider, { generatePagingContext } from './PagingGenerator'
import { readUserPageAction } from '@/actions/users/read'
import type { ReadPageInput } from '@/actions/Types'
import type { UserCursor, UserDetails, UserFiltered } from '@/server/users/Types'

export type PageSizeUsers = 50;
const fetcher = async (x: ReadPageInput<PageSizeUsers, UserCursor, UserDetails>) => {
    const users = await readUserPageAction(x)
    return users
}

export const UserPagingContext = generatePagingContext<UserFiltered, UserCursor, PageSizeUsers, UserDetails>()
const UserPagingProvider = generatePagingProvider({
    Context: UserPagingContext,
    fetcher,
    getCursorAfterFetch: data => (data.length ? { id: data[data.length - 1].id } : null),
})
export default UserPagingProvider
