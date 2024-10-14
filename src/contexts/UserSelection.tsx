'use client'
import { createContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { UserFiltered } from '@/services/users/Types'

type PropTypes = {
    children: ReactNode
    initialUser?: UserFiltered | null
}

/**
 * Context designed to be used with UserPagingContext and UserList.
 * If UserList is rendered inside IserSelectionProvider, it will display a checkbox next to each user.
 */
export const UserSelectionContext = createContext<{
    user: UserFiltered | null
    setUser: (user: UserFiltered | null) => void
    onSelection: (handler: (user: UserFiltered | null) => void) => void
        } | null>(null)

export default function UserSelectionProvider({ children, initialUser }: PropTypes) {
    const [user, setUser] = useState<UserFiltered | null>(initialUser ? initialUser : null)
    const onSelection = useRef<(user: UserFiltered | null) => void>(() => {})
    useEffect(() => {
        onSelection.current(user)
    }, [user])

    return <UserSelectionContext.Provider value={{ 
        user, 
        setUser, 
        onSelection: (handler: (user: UserFiltered | null) => void) => {
            onSelection.current = handler
        } 
    }}>
        {children}
    </UserSelectionContext.Provider>
}
