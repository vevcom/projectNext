import { getServerSession } from 'next-auth'
import { notFound, redirect } from 'next/navigation'
import type { Permission, User } from '@prisma/client'
import { authOptions } from './authoptions'

export type UserWithPermissions = Omit<User, 'id'> & {
    id: number,
    permissions: Permission[]
}

type GetUserArgsType<R extends boolean = boolean> = {
    requiredPermissions?: Permission[] | undefined,
    required?: R,
    redirectUrl?: string,
    returnUrl?: string,
}

type RequiredGetUserReturnType = {
    user: UserWithPermissions,
    authorized: true,
    status: 'AUTHORIZED',
}

type GetUserReturnType = RequiredGetUserReturnType | {
    user: null,
    authorized: false,
    status: 'UNAUTHENTICATED',
} | {
    user: UserWithPermissions,
    authorized: false,
    status: 'UNAUTHORIZED',
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
 * @param requiredPermissions - A list of permissions that the user must have.
 * @param required - Wheter or not to redirect the user if user is not authorized.
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
    required,
    redirectUrl,
    returnUrl,
}: GetUserArgsType = {}): Promise<GetUserReturnType> {
    const user = (await getServerSession(authOptions))?.user ?? null

    if (
        user && // Check if user is authenticated...
        (
            !requiredPermissions || // ...and if the user has all the required permissions (if any are given).
            requiredPermissions.every(permission => user.permissions.includes(permission))
        )
    ) {
        return { user, authorized: true, status: 'AUTHORIZED' }
    }

    if (required) {
        if (!user && returnUrl) {
            redirect(`/login?callbackUrl=${encodeURI(returnUrl)}`)
        }

        if (redirectUrl) {
            redirect(redirectUrl)
        }

        notFound() // Should probably redirect to an unauthorized page when we have one.
    }

    // Cannot have ternary expression for just status because then ts gets confused.
    return user
        ? { user, authorized: false, status: 'UNAUTHORIZED' }
        : { user, authorized: false, status: 'UNAUTHENTICATED' }
}
