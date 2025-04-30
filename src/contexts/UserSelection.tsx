'use client'
import { createContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { UserNameFiltered } from '@/services/users/Types'

type PropTypes = {
    children: ReactNode
    initialUser?: UserNameFiltered | null
}

/**
 * Context designed to be used with UserPagingContext and UserList.
 * If UserList is rendered inside IserSelectionProvider, it will display a checkbox next to each user.
 */
export const UserSelectionContext = createContext<{
    user: UserNameFiltered | null
    setUser: (user: UserNameFiltered | null) => void
    onSelection: (handler: (user: UserNameFiltered | null) => void) => void
        } | null>(null)

type Handler = (user: UserNameFiltered | null) => void

export default function UserSelectionProvider({ children, initialUser }: PropTypes) {
    const [user, setUser] = useState<UserNameFiltered | null>(initialUser ? initialUser : null)
    const onSelection = useRef<Handler>(() => {})
    useEffect(() => {
        onSelection.current(user)
    }, [user])

    return <UserSelectionContext.Provider value={{
        user,
        setUser,
        onSelection: (handler: Handler) => {
            onSelection.current = handler
        }
    }}>
        {children}
    </UserSelectionContext.Provider>
}
