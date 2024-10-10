'use server'
import { createActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { getUser } from '@/auth/getUser'
import { readGroupsExpanded } from '@/services/groups/read'
import { readUserPage } from '@/services/users/read'
import { Session } from '@/auth/Session'
import { User } from '@/services/users'
import type { ExpandedGroup } from '@/services/groups/Types'
import type { UserDetails, UserCursor, UserPagingReturn, Profile } from '@/services/users/Types'
import type { ActionReturn } from '@/actions/Types'
import type { ReadPageInput } from '@/services/paging/Types'
import type { Permission } from '@prisma/client'

/**
 * A action to read a page of users with the given details (filtering)
 * @param readPageInput - This is a) the page to read and b) the details to filter by like
 * name and groups
 * @returns
 */
export async function readUserPageAction<const PageSize extends number>(
    readPageInput: ReadPageInput<PageSize, UserCursor, UserDetails>
): Promise<ActionReturn<UserPagingReturn[]>> {
    const { status, authorized } = await getUser({
        requiredPermissions: [['USERS_READ']]
    })
    if (!authorized) return createActionError(status)

    return safeServerCall(() => readUserPage(readPageInput))
}

/**
 * Action meant to read the profile of a user.
 * A profile is a user with more information about them attached.
 * @param username - The username of the user to read
 * @returns - The profile of the user
 */
export async function readUserProfileAction(username: string): Promise<ActionReturn<Profile>> {
    const session = await Session.fromNextAuth()

    return safeServerCall(() => User.readProfile.client('NEW').execute({
        session, params: { username }
    }, { withAuth: true }))
}

export async function readUsersPermissionsAction(): Promise<ActionReturn<Permission[]>> {
    return {
        success: true,
        data: []
    }
}


export async function readGroupsForPageFiteringAction(): Promise<ActionReturn<ExpandedGroup[]>> {
    const { status, authorized } = await getUser({
        requiredPermissions: [['USERS_READ']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readGroupsExpanded())
}

