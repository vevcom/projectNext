'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { readUserPage } from '@/server/users/read'
import type { UserFiltered, UserDetails } from '@/server/users/Types'
import type { ActionReturn, ReadPageInput } from '@/actions/Types'
import { getUser } from '@/auth/getUser'
import { createActionError } from '../error'

/**
 * A action to read a page of users with the given details (filtering)
 * @param readPageInput - This is a) the page to read and b) the details to filter by like
 * name and groups
 * @returns
 */
export async function readUserPageAction<const PageSize extends number>(
    readPageInput: ReadPageInput<PageSize, UserDetails>
): Promise<ActionReturn<UserFiltered[]>> {
    const { status, authorized } = await getUser({
        requiredPermissions: [['USER_READ']]
    })
    if (!authorized) return createActionError(status)

    return safeServerCall(() => readUserPage(readPageInput))
}

export async function readGroupsForPageFiteringAction() {
    const { status, authorized } = await getUser({
        requiredPermissions: [['USER_READ']]
    })
    if (!authorized) return createActionError(status)


}