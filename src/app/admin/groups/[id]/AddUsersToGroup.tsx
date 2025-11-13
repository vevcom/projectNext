'use client'
import styles from './AddUsersToGroup.module.scss'
import UserList from '@/components/User/UserList/UserList'
import Form from '@/components/Form/Form'
import { createMembershipsForGroupAction } from '@/services/groups/memberships/actions'
import { UsersSelectionContext } from '@/contexts/UsersSelection'
import { useContext } from 'react'
import { useRouter } from 'next/navigation'
import type { PopUpKeyType } from '@/contexts/PopUp'

type PropTypes = {
    groupId: number,
    closePopUpOnSuccess: PopUpKeyType
}

export default function AddUsersToGroup({ groupId, closePopUpOnSuccess }: PropTypes) {
    const { refresh } = useRouter()
    const selectedUsersCtx = useContext(UsersSelectionContext)
    const users = selectedUsersCtx?.users || []

    return (
        <div className={styles.AddUsersToGroup}>
            {
                users.length ? (
                    <Form
                        submitText="Legg til brukere"
                        className={styles.submitForm}
                        action={createMembershipsForGroupAction.bind(null, {
                            groupId,
                            users: users.map(user => ({
                                userId: user.id,
                                admin: false
                            }))
                        })}
                        successCallback={refresh}
                        closePopUpOnSuccess={closePopUpOnSuccess}
                    />
                ) : null
            }

            <UserList className={styles.addUsersList} />
        </div>
    )
}
