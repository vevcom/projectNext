'use client'

import UserList from "@/app/components/User/UserList/UserList"
import { GroupSelectionContext } from "@/context/groupSelection"
import UserPagingProvider from "@/context/paging/UserPaging"
import { useCallback, useContext } from "react"
import styles from './GroupAdmin.module.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faX } from "@fortawesome/free-solid-svg-icons"

export default function GroupAdmin() {
    const groupSelectionCtx = useContext(GroupSelectionContext)
    if (!groupSelectionCtx) return null
    if (!groupSelectionCtx.group) return null

    const handleClose = useCallback(() => {
        groupSelectionCtx.setGroup(null)
    }, [groupSelectionCtx.setGroup])

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
            <div className={styles.GroupAdmin}>
                <button className={styles.close} onClick={handleClose}>
                    <FontAwesomeIcon icon={faX} />
                </button>
                <UserList />
            </div>
        </UserPagingProvider>
    )
}
