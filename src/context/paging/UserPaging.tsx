'use client'
import generatePagingProvider, { generatePagingContext } from './PagingGenerator'
import { readUserPage } from '@/actions/users/read'
import type { ReadPageInput } from '@/actions/type'
import type { UserDetails, UserFiltered } from '@/actions/users/Types'

export type PageSizeUsers = 50;
const fetcher = async (x: ReadPageInput<PageSizeUsers, UserDetails>) => {
    const users = await readUserPage(x)
    return users
}

export const UserPagingContext = generatePagingContext<UserFiltered, PageSizeUsers, UserDetails>()
const UserPagingProvider = generatePagingProvider({ Context: UserPagingContext, fetcher })
export default UserPagingProvider
