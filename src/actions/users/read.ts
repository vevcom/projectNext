'use server'
import { createActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { action } from '@/actions/action'
import { getUser } from '@/auth/getUser'
import { UserMethods } from '@/services/users/methods'
import { readGroupsExpanded } from '@/services/groups/read'
import type { ExpandedGroup } from '@/services/groups/Types'
import type { ActionReturn } from '@/actions/Types'

/**
 * A action to read a page of users with the given details (filtering)
 * @param readPageInput - This is a) the page to read and b) the details to filter by like
 * name and groups
 * @returns
 */
export const readUserPageAction = action(UserMethods.readPage)

/**
 * Action meant to read the profile of a user.
 * A profile is a user with more information about them attached.
 * @param username - The username of the user to read
 * @returns - The profile of the user
 */
export const readUserProfileAction = action(UserMethods.readProfile)

export const readUserAction = action(UserMethods.read)

//TODO: MOVE!!!
export async function readGroupsForPageFiteringAction(): Promise<ActionReturn<ExpandedGroup[]>> {
    const { status, authorized } = await getUser({
        requiredPermissions: [['USERS_READ']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readGroupsExpanded())
}

