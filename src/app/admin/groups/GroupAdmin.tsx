'use client'

import UserList from "@/app/components/User/UserList/UserList"
import { GroupSelectionContext } from "@/context/groupSelection"
import UserPagingProvider from "@/context/paging/UserPaging"
import { useContext } from "react"
import styles from './GroupAdmin.module.scss'

export default function GroupAdmin() {
    const groupSelectionCtx = useContext(GroupSelectionContext)
    if (!groupSelectionCtx) return <div className={styles.center}>Kan ikke velge gruppe</div>
    if (!groupSelectionCtx.group) return <div className={styles.center}>Ingen gruppe valgt</div>
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
