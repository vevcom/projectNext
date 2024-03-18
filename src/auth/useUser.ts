'use client'

import { checkPermissionMatrix } from './checkPermissionMatrix'
import { useSession } from 'next-auth/react'
import type { PermissionMatrix } from './checkPermissionMatrix'
import type { ExpandedUser } from './getUser'
import type { SessionContextValue } from 'next-auth/react'
import { readPermissionsOfDefaultUser } from '@/server/rolePermissions/read'
import { notFound, usePathname, useRouter } from 'next/navigation'

// SessionProvider needs to be exported from a 'use client' file so that it can
// be used in a server side file.
export { SessionProvider } from 'next-auth/react'

type UseUserArgsType<R extends boolean> = {
    requiredPermissions?: PermissionMatrix,
    userRequired?: boolean,
    shouldRedirect?: R,
    redirectUrl?: string,
    redirectToLogin?: boolean,
}

type UseUserReturnType<R extends boolean> = (R extends true ? {
    user: ExpandedUser,
    authorized: true,
} : {
    user: ExpandedUser | null,
    authorized: boolean,
}) & {
    status: SessionContextValue<R>['status']
}

/**
 * Wrapper for next-auth's `useSession`. Returns just the user object of the
 * current session, null otherwise.
*
* This function is for client side components. For server side components
* use `getUser``.
* @param requiredPermissions - A list of lists that the user must have. If non are given, the user is considered authorized
* regardless of their permissions.
* @param shouldRedirect - False by default. If true the user will be redirected when not authorized. Where the user will be
* redirected to will depend on the arguments below.
* @param redirectUrl - The homepage by default, if the user is not authorized they will be redirected here if
* redirect to login is disabled.
* @param redirectToLogin - True by default. If the user is not logged in they will be sent to the login page.
*
* @returns The user (always returned evne if it did not match the required permissions).
* The auth status, and if the user is authorized (i.e if there is a valif user and it matches the permissions)
*/
// Overloading is required here to get correct typehinting base on if required is true or false in options.
export async function useUser(options?: UseUserArgsType<false>): Promise<UseUserReturnType<false>>
export async function useUser(options?: UseUserArgsType<true>): Promise<UseUserReturnType<true>>
export async function useUser({
    requiredPermissions,
    userRequired,
    shouldRedirect,
    redirectUrl,
    redirectToLogin,
}: UseUserArgsType<boolean> = {}): Promise<UseUserReturnType<boolean>> {
    if (redirectToLogin === undefined) redirectToLogin = true

    const { data: session, status } = useSession({ 
        required: shouldRedirect && (redirectToLogin ?? true) || false 
    })

    const user = session?.user ?? null

    const userHasRequiredPermissions = async (requiredPermissions: PermissionMatrix, user: ExpandedUser | null): Promise<boolean> => {
        const userPermissions = user
            ? user.permissions
            : await readPermissionsOfDefaultUser()

        return checkPermissionMatrix(userPermissions, requiredPermissions)
    }

    // Authorized is true if both these conditions are true
    // 1. The user is logged inn or the user is not logged inn, but the user session is not required
    // 2. There are no required permissions or the user has all the required permissions
    const authorized = (
        (user || !userRequired) &&
        (!requiredPermissions || await userHasRequiredPermissions(requiredPermissions, user))
    )

    if (!authorized) {
        const { push } = useRouter()
        const pathName = usePathname()

        if (!user && redirectToLogin) {
            push(`/login?callbackUrl=${encodeURI(pathName)}`)
        }

        if (redirectUrl) {
            push(redirectUrl)
        }

        push('/') // TODO: Should be unauthorized page
    }

    //TODO: visibility checks
    return {
        user,
        status: authorized ? status : 'unauthenticated',
        authorized,
    }
}
