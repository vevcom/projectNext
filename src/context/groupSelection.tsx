import type { ReactNode } from "react"
import { createContext, useState } from "react"

export const GroupSelectionContext = createContext<{
    group: number | null,
    setGroup: (groupId: number | null) => void,
} |null>(null)

type PropTypes = {
    children: ReactNode
}

export default function GroupSelectionProvider({ children }: PropTypes) {
    const [group, setGroup] = useState<number | null>(null)

    return (
        <GroupSelectionContext.Provider value={{
            group,
            setGroup,
        }}>
            {children}
        </GroupSelectionContext.Provider>
    )
}