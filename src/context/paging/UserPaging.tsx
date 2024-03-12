'use client'
import generatePagingProvider, { generatePagingContext } from './PagingGenerator'
import { readUserPageAction } from '@/actions/users/read'
import type { ReadPageInput } from '@/actions/Types'
import type { UserDetails, UserFiltered } from '@/server/users/Types'

export type PageSizeUsers = 50;
const fetcher = async (x: ReadPageInput<PageSizeUsers, UserDetails>) => {
    const users = await readUserPageAction(x)
    return users
}

export const UserPagingContext = generatePagingContext<UserFiltered, PageSizeUsers, UserDetails>()
const UserPagingProvider = generatePagingProvider({ Context: UserPagingContext, fetcher })
export default UserPagingProvider
