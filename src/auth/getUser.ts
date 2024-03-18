import { authOptions } from './authoptions'
import { checkPermissionMatrix } from './checkPermissionMatrix'
import { getServerSession } from 'next-auth'
import { notFound, redirect } from 'next/navigation'
import type { PermissionMatrix } from './checkPermissionMatrix'
import type { Permission, User } from '@prisma/client'
import type { BasicMembership } from '@/server/groups/Types'
import { readPermissionsOfDefaultUser } from '@/server/rolePermissions/read'

export type ExpandedUser = Omit<User, 'id'> & {
    id: number,
    memberships: BasicMembership[]
    permissions: Permission[],
}

type GetUserArgsType<R extends boolean = boolean> = {
    requiredPermissions?: PermissionMatrix,
    userRequired?: boolean,
    shouldRedirect?: R,
    redirectUrl?: string,
    returnUrl?: string,
}

type RequiredGetUserReturnType = {
    user: ExpandedUser,
    authorized: true,
    status: 'AUTHORIZED',
}

type GetUserReturnType = RequiredGetUserReturnType | {
    user: null,
    authorized: false,
    status: 'UNAUTHENTICATED',
} | {
    user: ExpandedUser,
    authorized: false,
    status: 'UNAUTHORIZED',
} | {
    user: null,
    authorized: true,
    status: 'UNAUTHENTICATED',
}


export type AuthStatus = GetUserReturnType['status']

/**
 * Returns the user object from the current session. If there is no session or the
 * user does not have adequate permissions `null` is returned. Except if `required`
 * is true, then the user gets redirected.
 *
 * This function is for server side components and actions. For client side
 * components use `useUser`.
 *
 * @param requiredPermissions - A list of lists that the user must have
 * [[A, B], [C, D]] means the user must have (either A or B) and (either C or D).
 * If non are given, the user is considered authorized.
 *
 * @param userRequired - Wheter or not to a user session is required.
 *
 * @param redirect - Wheter or not to redirect the user if there is no session, by default false.
 * @param redirectUrl - The url to redirect the user to, by default to 404 page.
 * @param returnUrl - If set, the user is redirected to the login page and then back to the given url.
 *
 * @returns The user object and auth status (either `AUTHORIZED`, `UNAUTHENTICATED`, or `UNAUTHORIZED`).
 */
// This function is overloaded to get correct typing for when required is set to true or false.
export async function getUser(args?: GetUserArgsType<false>): Promise<GetUserReturnType>
export async function getUser(args?: GetUserArgsType<true>): Promise<RequiredGetUserReturnType>
export async function getUser({
    requiredPermissions,
    userRequired,
    shouldRedirect,
    redirectUrl,
    returnUrl,
}: GetUserArgsType = {}): Promise<GetUserReturnType> {
    const user = (await getServerSession(authOptions))?.user ?? null

    if (user && (!requiredPermissions || checkPermissionMatrix(user.permissions, requiredPermissions))) {
        return { user, authorized: true, status: 'AUTHORIZED' }
    }

    if (!user && !userRequired && requiredPermissions) {
        const defaultPermissions = await readPermissionsOfDefaultUser()
    
        if (checkPermissionMatrix(defaultPermissions, requiredPermissions)){
            return { user, authorized: true, status: 'UNAUTHENTICATED' }
        }
    }

    //TODO: visibility checks

    if (shouldRedirect) {
        if (!user && returnUrl) {
            redirect(`/login?callbackUrl=${encodeURI(returnUrl)}`)
        }

        if (redirectUrl) {
            redirect(redirectUrl)
        }

        notFound() //TODO: Should probably redirect to an unauthorized page when we have one.
    }

    // Cannot have ternary expression for just status because then ts gets confused.
    return user
        ? { user, authorized: false, status: 'UNAUTHORIZED' }
        : { user, authorized: false, status: 'UNAUTHENTICATED' }
}
