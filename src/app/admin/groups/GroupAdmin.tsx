'use client'

import styles from './GroupAdmin.module.scss'
import UserList from '@/app/components/User/UserList/UserList'
import { GroupSelectionContext } from '@/context/groupSelection'
import UserPagingProvider from '@/context/paging/UserPaging'
import { useCallback, useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'
import { CanEasalyManageMembership } from '@/server/groups/memberships/ConfigVars'
import PopUp from '@/app/components/PopUp/PopUp'
import UserSelectionProvider from '@/context/UserSelection'
import AddUsersToGroup from './AddUsersToGroup'

export default function GroupAdmin() {
    const groupSelectionCtx = useContext(GroupSelectionContext)
    const handleClose = useCallback(() => {
        groupSelectionCtx?.setGroup(null)
    }, [groupSelectionCtx?.setGroup])
    if (!groupSelectionCtx) return null
    if (!groupSelectionCtx.group) return null

    const group = groupSelectionCtx.group

    return (
        <UserPagingProvider
            serverRenderedData={[]}
            startPage={{
                page: 0,
                pageSize: 50
            }}
            details={{
                groups: [{
                    groupId: group.id,
                    groupOrder: null
                }],
                partOfName: ''
            }}
        >
            <div className={styles.GroupAdmin}>
                <button className={styles.close} onClick={handleClose}>
                    <FontAwesomeIcon icon={faX} />
                </button>
                <div className={styles.groupInfo}>
                    <h2>{group.name}</h2>
                    <p>Medlemmer: {group.members}</p>
                    <p>Orden: {group.order}</p>
                </div>
                <UserList disableFilters={{commitees: true}} />
                <PopUp PopUpKey={`Add user ${group.id}`} showButtonClass={styles.addUsers} showButtonContent={
                    <>Legg til brukere</>
                }>
                    <UserPagingProvider
                        serverRenderedData={[]}
                        startPage={{
                            page: 0,
                            pageSize: 50
                        }}
                        details={{
                            groups:[],
                            partOfName: ''
                        }}
                    >
                        <UserSelectionProvider>
                            <AddUsersToGroup />
                        </UserSelectionProvider>
                    </UserPagingProvider>
                </PopUp>
            </div>
        </UserPagingProvider>
    )
}
