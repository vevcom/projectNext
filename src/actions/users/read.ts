'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { readUserPage } from '@/services/users/read'
import type { UserFiltered, UserDetails, UserCursor } from '@/services/users/Types'
import type { ActionReturn } from '@/actions/Types'
import type { ReadPageInput } from '@/services/paging/Types'

/**
 * A action to read a page of users with the given details (filtering)
 * @param readPageInput - This is a) the page to read and b) the details to filter by like
 * name and groups
 * @returns
 */
export async function readUserPageAction<const PageSize extends number>(
    readPageInput: ReadPageInput<PageSize, UserCursor, UserDetails>
): Promise<ActionReturn<UserFiltered[]>> {
    //TODO: Permission check

    return safeServerCall(() => readUserPage(readPageInput))
}
