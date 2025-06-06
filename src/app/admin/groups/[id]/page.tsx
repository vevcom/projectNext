import styles from './page.module.scss'
import AddUsersToGroup from './AddUsersToGroup'
import GroupMembers from './GroupMembers'
import UserPagingProvider from '@/contexts/paging/UserPaging'
import { CanEasilyManageMembership } from '@/services/groups/memberships/ConfigVars'
import PopUp from '@/components/PopUp/PopUp'
import UsersSelectionProvider from '@/contexts/UsersSelection'
import { readGroupExpandedAction } from '@/actions/groups/read'
import Link from 'next/link'

type PropTypes = {
    params: Promise<{
        id: string
    }>
}

export default async function GroupAdmin({ params }: PropTypes) {
    const groupRes = await readGroupExpandedAction(parseInt((await params).id, 10))
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
                <div className={styles.groupInfo}>
                    <h1>{group.name}</h1>
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
                                <UsersSelectionProvider>
                                    <AddUsersToGroup groupId={group.id} closePopUpOnSuccess={`Add user ${group.id}`} />
                                </UsersSelectionProvider>
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
