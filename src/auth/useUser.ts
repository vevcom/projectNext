'use client'

import { checkPermissionMatrix } from './checkPermissionMatrix'
import { readPermissionsOfDefaultUser, readSpecialRole } from '@/server/rolePermissions/read'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import type { PermissionMatrix } from './checkPermissionMatrix'
import type { ExpandedUser } from './getUser'
import { useEffect, useState } from 'react'
import { Permission } from '@prisma/client'

// SessionProvider needs to be exported from a 'use client' file so that it can
// be used in a server side file.
export { SessionProvider } from 'next-auth/react'

type UseUserArgsType<ShouldRedirect extends boolean = false, UserRequired extends boolean = false> = {
    requiredPermissions?: PermissionMatrix,
    userRequired?: UserRequired,
    shouldRedirect?: ShouldRedirect,
    redirectUrl?: string,
    redirectToLogin?: boolean,
}

type AuthorizedUseUserReturnType<UserRequired extends boolean = false> = {
    user: ExpandedUser,
    authorized: true,
    status: 'AUTHORIZED',
} | (
    UserRequired extends true ? never : {
        user: null,
        authorized: true,
        status: 'AUTHORIZED_NO_USER',
    }
) | {
    user: null,
    authorized: null,
    status: 'LOADING',
}

type UseUserReturnType<UserRequired extends boolean = false> = (
    AuthorizedUseUserReturnType<UserRequired>
) | {
    user: null,
    authorized: false,
    status: 'UNAUTHENTICATED',
} | {
    user: ExpandedUser,
    authorized: false,
    status: 'UNAUTHORIZED',
}

export type ClientAuthStatus = UseUserReturnType['status']

/**
 * Wrapper for next-auth's `useSession`. Returns just the user object of the
 * current session, null otherwise.
*
* This function is for client side components. For server side components
* use `getUser``.
* @param requiredPermissions - A list of lists that the user must have. If non are given, the user is considered authorized
* regardless of their permissions.
* @param userRequired - False by default. If true the user will only be unauthorized if they are not logged inn.
* @param shouldRedirect - False by default. If true the user will be redirected when not authorized. Where the user will be
* redirected to will depend on the arguments below.
* @param redirectUrl - The homepage by default, if the user is not authorized they will be redirected here if
* redirect to login is disabled.
* @param redirectToLogin - True by default. If the user is not logged in they will be sent to the login page.
*
* @returns The user (always returned if `shouldRedirect` and `userRequired` is true).
* The auth status, and if the user is authorized (i.e. if the user fufilles the given requirements)
*/
// Overloading is required here to get correct typehinting base on if required is true or false in options.
export function useUser<UserRequired extends boolean = false>(
    args?: UseUserArgsType<false, UserRequired>
): UseUserReturnType<UserRequired>
export function useUser<UserRequired extends boolean = false>(
    args?: UseUserArgsType<true, UserRequired>
): AuthorizedUseUserReturnType<UserRequired>
export function useUser({
    requiredPermissions,
    userRequired,
    shouldRedirect,
    redirectUrl,
    redirectToLogin,
}: UseUserArgsType<boolean, boolean> = {}): UseUserReturnType<boolean> {
    const { push } = useRouter()
    const pathName = usePathname()
    const [ user, setUser ] = useState<ExpandedUser | null>(null)
    const [ userPermissions, setUserPermissions ] = useState<Permission[] | undefined>(undefined)
    const [ useUserReturn, setUseuserReturn ] = useState<UseUserReturnType<boolean>>({
        status: 'LOADING',
        authorized: null,
        user: null,
    })

    if (redirectToLogin === undefined) redirectToLogin = true
    
    const { data: session, status: nextAuthStatus } = useSession({
        required: shouldRedirect && (redirectToLogin ?? true) || false
    })
    
    useEffect(() => {
        setUser(session?.user ?? null)
    }, [session])

    useEffect(() => {
        if (user !== null) {
            setUserPermissions(user.permissions)
            return
        }

        readPermissionsOfDefaultUser().then(
            permissions => setUserPermissions(permissions)
        )
    })

    useEffect(() => {
        if (nextAuthStatus === 'loading' || userPermissions === undefined) return

        // Authorized is true if both these conditions are true
        // 1. The user is logged inn or the user is not logged inn, but the user session is not required
        // 2. There are no required permissions or the user has all the required permissions
        if ((!userRequired || user) && (!requiredPermissions || checkPermissionMatrix(userPermissions, requiredPermissions))) {
            setUseuserReturn(user ? {
                user,
                authorized: true,
                status: 'AUTHORIZED',
            } : {
                user,
                authorized: true,
                status: 'AUTHORIZED_NO_USER',
            })
            return
        }

        if (shouldRedirect) {
            if (!user && redirectToLogin) {
                push(`/login?callbackUrl=${encodeURI(pathName)}`)
            }
    
            if (redirectUrl) {
                push(redirectUrl)
            }
    
            push('/') // TODO: Should be unauthorized page
        }

        setUseuserReturn(user ? {
            user,
            authorized: false,
            status: 'UNAUTHORIZED',
        } : {
            user,
            authorized: false,
            status: 'UNAUTHENTICATED',
        })
    }, [user, nextAuthStatus, userPermissions])

    return useUserReturn
}
