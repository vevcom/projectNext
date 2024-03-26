import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { UserFiltered } from '@/server/users/Types'

type PropTypes = {
    children: ReactNode
}

/**
 * Context designed to be used with UserPagingContext and UserList.
 * If UserList is rendered inside IserSelectionProvider, it will display a checkbox next to each user.
 */
export const UserSelectionContext = createContext<{
    users: UserFiltered[]
    addUser: (user: UserFiltered) => void
    removeUser: (user: UserFiltered) => void
    toggle: (user: UserFiltered) => void
    includes: (user: UserFiltered) => boolean
        } | null>(null)

export default function UserSelectionProvider({ children }: PropTypes) {
    const [users, setUsers] = useState<UserFiltered[]>([])

    const addUser = (user: UserFiltered) => {
        setUsers([...users, user])
    }
    const removeUser = (user: UserFiltered) => {
        setUsers(users.filter(u => u !== user))
    }
    const toggle = (user: UserFiltered) => {
        if (users.includes(user)) {
            removeUser(user)
        } else {
            addUser(user)
        }
    }

    const includes = (user: UserFiltered) => users.includes(user)

    return <UserSelectionContext.Provider value={{ users, addUser, removeUser, toggle, includes }}>
        {children}
    </UserSelectionContext.Provider>
}
