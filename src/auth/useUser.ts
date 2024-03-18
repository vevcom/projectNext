'use client'

import { checkPermissionMatrix } from './checkPermissionMatrix'
import { useSession } from 'next-auth/react'
import type { PermissionMatrix } from './checkPermissionMatrix'
import type { ExpandedUser } from './getUser'
import type { SessionContextValue } from 'next-auth/react'

// SessionProvider needs to be exported from a 'use client' file so that it can
// be used in a server side file.
export { SessionProvider } from 'next-auth/react'

type UseUserArgsType<R extends boolean> = {
    required?: R,
    requiredPermissions?: PermissionMatrix,
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
* @param required - false by default. If true the next-auth useSession will require that a user is logged in.
* @param requiredPermissions - A list of lists that the user must have. If non are given, the user is considered authorized
* if the user exists.
*
* @returns The user (always returned evne if it did not match the required permissions).
* The auth status, and if the user is authorized (i.e if there is a valif user and it matches the permissions)
*/
// Overloading is required here to get correct typehinting base on if required is true or false in options.
export function useUser(options?: UseUserArgsType<false>): UseUserReturnType<false>
export function useUser(options?: UseUserArgsType<true>): UseUserReturnType<true>
export function useUser({
    required,
    requiredPermissions,
}: UseUserArgsType<boolean> = {}): UseUserReturnType<boolean> {
    const { data: session, status } = useSession({ required: required || false })
    const user = session?.user ?? null

    const authorized = requiredPermissions && user ? checkPermissionMatrix(user, requiredPermissions) : Boolean(user)
    //TODO: visibility checks
    return {
        user,
        status: authorized ? status : 'unauthenticated',
        authorized
    }
}
