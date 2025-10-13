'use client'
import styles from './GroupMembers.module.scss'
import MembershipAdminForUser from './MembershipAdminForUser'
import UserList from '@/components/User/UserList/UserList'
import PopUp from '@/components/PopUp/PopUp'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import type { ExpandedGroup } from '@/services/groups/types'

type PropTypes = {
    group: ExpandedGroup
}

export default function GroupMembers({ group }: PropTypes) {
    return (
        <UserList
            displayForUser={user => (
                <PopUp
                    PopUpKey={`Admin for ${user.id}`}
                    showButtonContent={
                        <FontAwesomeIcon icon={faCog} />
                    }
                >
                    <MembershipAdminForUser user={user} group={group} />
                </PopUp>
            )}
            className={styles.GroupMembers}
            disableFilters={{ [group.groupType]: true }}
        />
    )
}
