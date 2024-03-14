'use server'
import { readUserPage } from '@/server/users/read'
import type { UserFiltered, UserDetails } from '@/server/users/Types'
import type { ActionReturn, ReadPageInput } from '@/actions/Types'

/**
 * A action to read a page of users with the given details (filtering)
 * @param readPageInput - This is a) the page to read and b) the details to filter by like
 * name and groups
 * @returns
 */
export async function readUserPageAction<const PageSize extends number>(
    readPageInput: ReadPageInput<PageSize, UserDetails>
): Promise<ActionReturn<UserFiltered[]>> {
    //TODO: Permission check

    return await readUserPage(readPageInput)
}
