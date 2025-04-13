'use client'

import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { UserNameFiltered } from '@/services/users/Types'

type PropTypes = {
    children: ReactNode
}

/**
 * Context designed to be used with UserPagingContext and UserList.
 * If UserList is rendered inside IserSelectionProvider, it will display a checkbox next to each user.
 */
export const UsersSelectionContext = createContext<{
    users: UserNameFiltered[]
    addUser: (user: UserNameFiltered) => void
    removeUser: (user: UserNameFiltered) => void
    toggle: (user: UserNameFiltered) => void
    includes: (user: UserNameFiltered) => boolean
        } | null>(null)

export default function UsesrSelectionProvider({ children }: PropTypes) {
    const [users, setUsers] = useState<UserNameFiltered[]>([])

    const addUser = (user: UserNameFiltered) => {
        setUsers([...users, user])
    }
    const removeUser = (user: UserNameFiltered) => {
        setUsers(users.filter(u => u !== user))
    }
    const toggle = (user: UserNameFiltered) => {
        if (users.includes(user)) {
            removeUser(user)
        } else {
            addUser(user)
        }
    }

    const includes = (user: UserNameFiltered) => users.includes(user)

    return <UsersSelectionContext.Provider value={{ users, addUser, removeUser, toggle, includes }}>
        {children}
    </UsersSelectionContext.Provider>
}
