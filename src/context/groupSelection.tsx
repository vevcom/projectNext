'use client'

import { createContext, useState } from 'react'
import type { ExpandedGroup } from '@/server/groups/Types'
import type { ReactNode } from 'react'

export const GroupSelectionContext = createContext<{
    group: ExpandedGroup | null,
    setGroup: (group: ExpandedGroup | null) => void,
        } |null>(null)

type PropTypes = {
    children: ReactNode
}

export default function GroupSelectionProvider({ children }: PropTypes) {
    const [group, setGroup] = useState<ExpandedGroup | null>(null)

    return (
        <GroupSelectionContext.Provider value={{
            group,
            setGroup,
        }}>
            {children}
        </GroupSelectionContext.Provider>
    )
}
