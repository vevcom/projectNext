'use client'

import { useSession } from 'next-auth/react'
import type { UserWithPermissions } from './getUser'
import type { SessionContextValue } from 'next-auth/react'

// SessionProvider needs to be exported from a 'use client' file so that it can
// be used in a server side file.
export { SessionProvider } from 'next-auth/react'

type UseUserArgsType<R extends boolean> = {
    required?: R,
}

type UseUserReturnType<R extends boolean> = (R extends true ? {
    user: UserWithPermissions,
    authorized: true,
} : {
    user: UserWithPermissions | null,
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
*/
// Overloading is required here to get correct typehinting base on if required is true or false in options.
export function useUser(options?: UseUserArgsType<false>): UseUserReturnType<false>
export function useUser(options?: UseUserArgsType<true>): UseUserReturnType<true>
export function useUser({ required }: UseUserArgsType<boolean> = {}): UseUserReturnType<boolean> {
    const { data: session, status } = useSession({ required: required || false })
    
    const user = session?.user ?? null
    const authorized = Boolean(user)

    return { user, status, authorized }
}
