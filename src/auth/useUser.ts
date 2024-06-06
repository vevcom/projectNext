'use client'

import { checkPermissionMatrix } from './checkPermissionMatrix'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import type { Permission } from '@prisma/client'
import type { UserFiltered } from '@/server/users/Types'
import type { PermissionMatrix } from './checkPermissionMatrix'
import type { BasicMembership } from '@/server/groups/Types'
import { DefaultPermissionsContext } from '@/context/DefaultPermissions'

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

type AuthorizedUseUserReturnType<UserRequired extends boolean = false> = ({
    user: UserFiltered,
    authorized: true,
    status: 'AUTHORIZED',
} | (
    UserRequired extends true ? never : {
        user: null,
        authorized: true,
        status: 'AUTHORIZED_NO_USER',
    }
)) & {
    permissions: Permission[],
    memberships: BasicMembership[],
} | {
    user: undefined,
    authorized: undefined,
    status: 'LOADING',
    permissions: undefined,
    memberships: undefined,
}

type UseUserReturnType<UserRequired extends boolean = false> = (
    AuthorizedUseUserReturnType<UserRequired>
) | ({
    user: null,
    authorized: false,
    status: 'UNAUTHENTICATED',
} | {
    user: UserFiltered,
    authorized: false,
    status: 'UNAUTHORIZED',
}) & {
    permissions: Permission[],
    memberships: BasicMembership[],
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
* @param shouldRedirect - True by default. If true the user will be redirected when not authorized. Where the user will be
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
    requiredPermissions = [],
    userRequired = false,
    shouldRedirect = false,
    redirectUrl = '/', // TODO: Should be unauthorized page by default
    redirectToLogin = true,
}: UseUserArgsType<boolean, boolean> = {}): UseUserReturnType<boolean> {
    const { push } = useRouter()
    const pathName = usePathname()
    const defaultPermissionsCtx = useContext(DefaultPermissionsContext)
    const defaultPermissions = defaultPermissionsCtx ? defaultPermissionsCtx.defaultPermissions : []
    const [useUserReturn, setUseuserReturn] = useState<UseUserReturnType<boolean>>({
        status: 'LOADING',
        authorized: undefined,
        user: undefined,
        memberships: undefined,
        permissions: undefined,
    })

    const { data: session, status: nextAuthStatus } = useSession({
        required: shouldRedirect && redirectToLogin,
    })

    useEffect(() => {
        if (nextAuthStatus === 'loading') return

        const {
            user = null,
            permissions = defaultPermissions,
            memberships = [],
        } = session ?? {}

        // Authorized is true if both these conditions are true
        // 1. The user is logged inn or (the user is not logged inn and the user session is not required)
        // 2. The user has all the required permissions
        if ((user || !userRequired) && checkPermissionMatrix(permissions, requiredPermissions)) {
            setUseuserReturn(user
                ? { user, authorized: true, status: 'AUTHORIZED', permissions, memberships }
                : { user, authorized: true, status: 'AUTHORIZED_NO_USER', permissions, memberships }
            )
            return
        }

        if (shouldRedirect) {
            // The next auth useSession function will redirect the user to the login page if there
            // is no user session at all. However, since we can have authorized users without a
            // session we can only use this feature if userRequired is true. Therefore we need to
            // handle the case where userRequired is false and the deafult permissions aren't
            // enough our selves.
            if (!user && redirectToLogin) {
                push(`/login?callbackUrl=${encodeURI(pathName)}`)
            }

            push(redirectUrl)
        }

        setUseuserReturn(user
            ? { user, authorized: false, status: 'UNAUTHORIZED', permissions, memberships }
            : { user, authorized: false, status: 'UNAUTHENTICATED', permissions, memberships }
        )
    }, [session, nextAuthStatus])

    return useUserReturn
}
