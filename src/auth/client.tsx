'use client'

import { useSession } from 'next-auth/react'
import type { UseSessionOptions } from 'next-auth/react'
/**
 * Wrapper for next-auth's ```useSession```. Returns just the user object of the
 * current session, null otherwise.
*
* This function is for client side components. For server side components
* use ```getUser``` or ```requireUser```.
*/
export function useUser<R extends boolean>(options?: UseSessionOptions<R>) {
    const { data: session, status } = useSession(options)

    return { user: session?.user ?? null, status }
}

export { SessionProvider as AuthProvider } from 'next-auth/react'
