'use client'
import { Session } from './Session'
import { DefaultPermissionsContext } from '@/contexts/DefaultPermissions'
import { useSession as useSessionNextAuth } from 'next-auth/react'
import { useContext } from 'react'

export { SessionProvider } from 'next-auth/react'

type UseSessionReturn = { loading: true } | { loading: false, session: Session<'NO_USER'> | Session<'HAS_USER'> }

export function useSession(): UseSessionReturn {
    const defaultPermissionsContext = useContext(DefaultPermissionsContext)
    const defaultPermissions = defaultPermissionsContext ? defaultPermissionsContext.defaultPermissions : []

    const { data: session, status: nextAuthStatus } = useSessionNextAuth()
    switch (nextAuthStatus) {
        case 'loading':
            return { loading: true }
        case 'unauthenticated':
            return { loading: false, session: Session.fromDefaultPermissions(defaultPermissions) }
        case 'authenticated':
            return { loading: false, session: Session.fromJsObject(session) }
        default:
            return { loading: false, session: Session.fromDefaultPermissions(defaultPermissions) }
    }
}
