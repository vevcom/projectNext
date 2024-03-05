'use client'

import { useSession } from 'next-auth/react'
import type { SessionContextValue, UseSessionOptions } from 'next-auth/react'
import { UserWithPermissions } from '.'

type UseUserReturnType<R extends boolean> = R extends true ? {
    user: UserWithPermissions,
    status: SessionContextValue<R>['status']
} : {
    user: UserWithPermissions | null,
    status: SessionContextValue<R>['status']
}

/**
 * Wrapper for next-auth's `useSession`. Returns just the user object of the
 * current session, null otherwise.
*
* This function is for client side components. For server side components
* use `getUser``.
*/
// Overloading is required here to get correct typehinting base on if required is true or false in options.
export function useUser(options?: UseSessionOptions<false>): UseUserReturnType<false>
export function useUser(options?: UseSessionOptions<true>): UseUserReturnType<true>
export function useUser(options?: UseSessionOptions<boolean>): UseUserReturnType<boolean> {
    const { data: session, status } = useSession(options)

    return { user: session?.user ?? null, status }
}