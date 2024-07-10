import styles from './page.module.scss'
import AddUsersToGroup from './AddUsersToGroup'
import GroupMembers from './GroupMembers'
import UserPagingProvider from '@/context/paging/UserPaging'
import { CanEasilyManageMembership } from '@/server/groups/memberships/ConfigVars'
import PopUp from '@/app/components/PopUp/PopUp'
import UserSelectionProvider from '@/context/UserSelection'
import { readGroupExpandedAction } from '@/actions/groups/read'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

type PropTypes = {
    params: {
        id: string
    }
}

export default async function GroupAdmin({ params }: PropTypes) {
    const groupRes = await readGroupExpandedAction(parseInt(params.id, 10))
    if (!groupRes.success) throw new Error('Failed to load group')
    const group = groupRes.data

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
            <div className={styles.wrapper}>
                <Link href="/admin/groups">
                    <FontAwesomeIcon icon={faArrowLeft} />
                </Link>
                <div className={styles.groupInfo}>
                    <h2>{group.name}</h2>
                    <p>Medlemmer: {group.members}</p>
                    <p>Orden: {group.order}</p>
                </div>
                <GroupMembers group={group} />
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
