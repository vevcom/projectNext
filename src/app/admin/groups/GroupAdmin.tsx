'use client'

import UserList from "@/app/components/User/UserList/UserList"
import { GroupSelectionContext } from "@/context/groupSelection"
import UserPagingProvider from "@/context/paging/UserPaging"
import { useContext } from "react"

export default function GroupAdmin() {
    const groupSelectionCtx = useContext(GroupSelectionContext)
    if (!groupSelectionCtx) return <>Kan ikke velge gruppe</>
    if (!groupSelectionCtx.group) return <>Ingen gruppe valgt</>
    return (
        <UserPagingProvider
            serverRenderedData={[]}
            startPage={{
                page: 0,
                pageSize: 50
            }}
            details={{
                groups: [groupSelectionCtx.group],
                partOfName: ''
            }}
        >
            <UserList />
        </UserPagingProvider>
    )
}
