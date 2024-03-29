'use client'

import styles from './GroupAdmin.module.scss'
import AddUsersToGroup from './AddUsersToGroup'
import UserList from '@/app/components/User/UserList/UserList'
import { GroupSelectionContext } from '@/context/groupSelection'
import UserPagingProvider from '@/context/paging/UserPaging'
import { CanEasalyManageMembership } from '@/server/groups/memberships/ConfigVars'
import PopUp from '@/app/components/PopUp/PopUp'
import UserSelectionProvider from '@/context/UserSelection'
import { faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useContext } from 'react'
import Link from 'next/link'

export default function GroupAdmin() {
    const groupSelectionCtx = useContext(GroupSelectionContext)
    const handleClose = useCallback(() => {
        groupSelectionCtx?.setGroup(null)
    }, [groupSelectionCtx?.setGroup])
    if (!groupSelectionCtx) return null
    if (!groupSelectionCtx.group) return null

    const group = groupSelectionCtx.group

    const canEasalyManageMembership = CanEasalyManageMembership[group.groupType]

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
                    groupOrder: 'ACTIVE'
                }],
                partOfName: '',
                extraInfoOnMembership: {
                    groupId: group.id,
                    groupOrder: 'ACTIVE'
                }
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
                <UserList className={styles.groupMembers} disableFilters={{ [group.groupType]: true }} />
                {
                    canEasalyManageMembership ? (
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
                                    groups: [],
                                    partOfName: ''
                                }}
                            >
                                <UserSelectionProvider>
                                    <AddUsersToGroup groupId={group.id} />
                                </UserSelectionProvider>
                            </UserPagingProvider>
                        </PopUp>
                    ) : (
                        (
                            group.groupType === 'CLASS' &&
                                <Link href="/admin/classes" className={styles.link}>Gå til Kalssersiden</Link>
                        )
                        || (
                            group.groupType === 'OMEGA_MEMBERSHIP_GROUP' &&
                                <Link href="/admin/admission" className={styles.link}>Gå til opptakssiden</Link>
                        )
                    )
                }

            </div>
        </UserPagingProvider>
    )
}
