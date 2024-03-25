import { UserFiltered } from "@/server/users/Types";
import { createContext, useState } from "react";
import { ReactNode } from "react";

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
} | null>(null)

export default function UserSelectionProvider({ children }: PropTypes) {
    const [users, setUsers] = useState<UserFiltered[]>([])

    const addUser = (user: UserFiltered) => {
        setUsers([...users, user])
    }
    const removeUser = (user: UserFiltered) => {
        setUsers(users.filter(u => u !== user))
    }

    return <UserSelectionContext.Provider value={{ users, addUser, removeUser }}>
        {children}
    </UserSelectionContext.Provider>
}