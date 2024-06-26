'use client'
import styles from './GroupAdmin.module.scss'
import AddUsersToGroup from './AddUsersToGroup'
import UserList from '@/app/components/User/UserList/UserList'
import { GroupSelectionContext } from '@/context/groupSelection'
import UserPagingProvider from '@/context/paging/UserPaging'
import { CanEasilyManageMembership } from '@/server/groups/memberships/ConfigVars'
import PopUp from '@/app/components/PopUp/PopUp'
import UserSelectionProvider from '@/context/UserSelection'
import Form from '@/app/components/Form/Form'
import { updateMembershipActiveAction, updateMembershipAdminAcion } from '@/actions/groups/memberships/update'
import { faCog, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useContext } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function GroupAdmin() {
    const groupSelectionCtx = useContext(GroupSelectionContext)
    const handleClose = useCallback(() => {
        groupSelectionCtx?.setGroup(null)
    }, [groupSelectionCtx?.setGroup])
    const { refresh } = useRouter()

    if (!groupSelectionCtx) return null
    if (!groupSelectionCtx.group) return null

    const group = groupSelectionCtx.group

    const canEasilyManageMembership = CanEasilyManageMembership[group.groupType]

    return (
        <UserPagingProvider
            serverRenderedData={[]}
            startPage={{
                page: 0,
                pageSize: 50
            }}
            details={{
                groups: [],
                partOfName: '',
                selectedGroup: {
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
                <UserList
                    displayForUser={user => (
                        <PopUp
                            PopUpKey={`Admin for ${user.id}`}
                            showButtonContent={
                                <FontAwesomeIcon icon={faCog} />
                            }
                        >
                            <p>{user.firstname} {user.lastname}</p>
                            <i>{user.username}</i>
                            <Form
                                submitText="Deaktiver medlemsskap"
                                action={updateMembershipActiveAction.bind(null, {
                                    groupId: group.id,
                                    userId: user.id
                                }).bind(null, false)}
                                successCallback={refresh}
                                key={`Deactivate ${user.id}`}
                                closePopUpOnSuccess={`Admin for ${user.id}`}
                            />
                            <Form
                                submitText={user.selectedGroupInfo?.admin ? 'Fjern admin' : 'Gjør til admin'}
                                action={updateMembershipAdminAcion.bind(null, {
                                    groupId: group.id,
                                    userId: user.id
                                }).bind(null, !user.selectedGroupInfo?.admin)}
                                successCallback={refresh}
                                key={`Admin ${user.id}`}
                                closePopUpOnSuccess={`Admin for ${user.id}`}
                            />
                        </PopUp>
                    )}
                    className={styles.groupMembers}
                    disableFilters={{ [group.groupType]: true }}
                />
                {
                    canEasilyManageMembership ? (
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
                                    <AddUsersToGroup groupId={group.id} closePopUpOnSuccess={`Add user ${group.id}`} />
                                </UserSelectionProvider>
                            </UserPagingProvider>
                        </PopUp>
                    ) : (
                        (
                            group.groupType === 'CLASS' &&
                                <Link href="/admin/classes" className={styles.link}>Gå til Kalsseadministrasjon</Link>
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
