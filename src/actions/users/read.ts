'use server'
import { createActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { readUserPage } from '@/server/users/read'
import { getUser } from '@/auth/getUser'
import { readGroupsExpanded } from '@/server/groups/read'
import type { ExpandedGroup } from '@/server/groups/Types'
import type { UserFiltered, UserDetails, UserCursor, UserPagingReturn } from '@/server/users/Types'
import type { ActionReturn } from '@/actions/Types'
import type { ReadPageInput } from '@/server/paging/Types'

/**
 * A action to read a page of users with the given details (filtering)
 * @param readPageInput - This is a) the page to read and b) the details to filter by like
 * name and groups
 * @returns
 */
export async function readUserPageAction<const PageSize extends number>(
    readPageInput: ReadPageInput<PageSize, UserCursor ,UserDetails>
): Promise<ActionReturn<UserPagingReturn[]>> {
    const { status, authorized } = await getUser({
        requiredPermissions: [['USERS_READ']]
    })
    if (!authorized) return createActionError(status)

    return safeServerCall(() => readUserPage(readPageInput))
}

export async function readGroupsForPageFiteringAction(): Promise<ActionReturn<ExpandedGroup[]>> {
    const { status, authorized } = await getUser({
        requiredPermissions: [['USERS_READ']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readGroupsExpanded())
}
