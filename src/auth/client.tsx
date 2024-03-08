'use client'

import { useSession } from 'next-auth/react'
import type { SessionContextValue, UseSessionOptions } from 'next-auth/react'
import { UserWithPermissions } from '.'
import { Permission } from '@prisma/client'
import { useEffect } from 'react'

// SessionProvider needs to be exported from a 'use client' file so that it can
// be used in a server side file.
export { SessionProvider } from 'next-auth/react'

type UseUserArgsType<R extends boolean> = {
    required?: R,
    requiredPermissions?: Permission[]
}

type UseUserReturnType<R extends boolean> = (R extends true ? {
    user: UserWithPermissions,
} : {
    user: UserWithPermissions | null,
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
export function useUser({ required, requiredPermissions }: UseUserArgsType<boolean> = {}): UseUserReturnType<boolean> {
    const { data: session, status } = useSession({ required: required || false })

    const user = session?.user ?? null
    
    useEffect(() => {
        if (!requiredPermissions || !user) return
        if (!requiredPermissions.every(permission => user.permissions.includes(permission))) window.location.href = `/login?callbackUrl=${window.location.href}`
    }, [user])

    return { user, status }
}