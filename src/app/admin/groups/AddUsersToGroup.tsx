'use client'
import styles from './AddUsersToGroup.module.scss'
import UserList from '@/app/components/User/UserList/UserList'
import Form from '@/app/components/Form/Form'
import { createMembershipsForGroupAction } from '@/actions/groups/memberships/create'
import { UserSelectionContext } from '@/context/UserSelection'
import { useContext } from 'react'
import { useRouter } from 'next/navigation'
import { PopUpKeyType } from '@/context/PopUp'

type PropTypes = {
    groupId: number,
    closePopUpOnSuccess: PopUpKeyType
}

export default function AddUsersToGroup({ groupId, closePopUpOnSuccess }: PropTypes) {
    const { refresh } = useRouter()
    const selectedUsersCtx = useContext(UserSelectionContext)
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
