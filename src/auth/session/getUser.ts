import '@pn-server-only'
import { authOptions } from '@/auth/nextAuth/authOptions'
import checkMatrix from '@/lib/checkMatrix'
import { permissionOperations } from '@/services/permissions/operations'
import { getServerSession } from 'next-auth'
import { notFound, redirect } from 'next/navigation'
import type { Matrix } from '@/lib/checkMatrix'
import type { Permission } from '@prisma/client'
import type { MembershipFiltered } from '@/services/groups/memberships/types'
import type { UserFiltered } from '@/services/users/types'

type GetUserArgsType<ShouldRedirect extends boolean = false, UserRequired extends boolean = false> = {
    requiredPermissions?: Matrix<Permission>,
    userRequired?: UserRequired,
    shouldRedirect?: ShouldRedirect,
    redirectUrl?: string,
    returnUrl?: string,
}

type AuthorizedGetUserReturnType<UserRequired extends boolean = false> = ({
    user: UserFiltered,
    status: 'AUTHORIZED',
} | (
    UserRequired extends true ? never : {
        user: null,
        status: 'AUTHORIZED_NO_USER',
    }
)) & {
    authorized: true,
    permissions: Permission[],
    memberships: MembershipFiltered[],
}

type UnAuthorizedGetUserReturnType = ({
    user: null,
    status: 'UNAUTHENTICATED',
} | {
    user: UserFiltered,
    status: 'UNAUTHORIZED',
}) & {
    authorized: false,
    permissions: Permission[],
    memberships: MembershipFiltered[],
}

export type GetUserReturnType<UserRequired extends boolean = false> = (
    AuthorizedGetUserReturnType<UserRequired>
) | (
    UnAuthorizedGetUserReturnType
)


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
 * @returns The user object and auth status
 * (either `AUTHORIZED`, `AUTHORIZED_NO_USER`, `UNAUTHENTICATED`, or `UNAUTHORIZED`).
 *
 * @deprecated - Deprecated as the new service mehtod system handles this.
 * For getting the user in the app router a utility function will be developed.
 */
// This function is overloaded to get correct typing for when required is set to true or false.
export async function getUser<UserRequired extends boolean = false>(
    args?: GetUserArgsType<false, UserRequired>
): Promise<GetUserReturnType<UserRequired>>
export async function getUser<UserRequired extends boolean = false>(
    args?: GetUserArgsType<true, UserRequired>
): Promise<AuthorizedGetUserReturnType<UserRequired>>
export async function getUser({
    requiredPermissions = [],
    userRequired = false,
    shouldRedirect = false,
    redirectUrl = undefined,
    returnUrl = undefined,
}: GetUserArgsType<boolean, boolean> = {}): Promise<GetUserReturnType<boolean>> {
    const {
        user = null,
        permissions = await permissionOperations.readDefaultPermissions({
            bypassAuth: true,
        }),
        memberships = [],
    } = await getServerSession(authOptions) ?? {}

    if (shouldRedirect && user && !user.acceptedTerms) {
        if (returnUrl) {
            redirect(`/register?callbackUrl=${returnUrl}`)
        }
        redirect('/register')
    }

    if ((user || !userRequired) && checkMatrix(permissions, requiredPermissions)) {
        // Cannot have ternary expression for just status because then ts gets confused.
        return user
            ? { user, authorized: true, status: 'AUTHORIZED', permissions, memberships }
            : { user, authorized: true, status: 'AUTHORIZED_NO_USER', permissions, memberships }
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
        ? { user, authorized: false, status: 'UNAUTHORIZED', permissions, memberships }
        : { user, authorized: false, status: 'UNAUTHENTICATED', permissions, memberships }
}
