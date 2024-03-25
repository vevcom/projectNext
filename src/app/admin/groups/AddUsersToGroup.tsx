'use client'
import UserList from "@/app/components/User/UserList/UserList"
import styles from './AddUsersToGroup.module.scss'
import Form from "@/app/components/Form/Form"
import { createMembershipsForGroupAction } from "@/actions/groups/memberships/create"
import { use, useContext } from "react"
import { UserSelectionContext } from "@/context/UserSelection"
import { useRouter } from "next/navigation"

type PropTypes = {
    groupId: number
}

export default function AddUsersToGroup({ groupId }: PropTypes) {
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
                    />
                ) : null
            }
            
            <UserList className={styles.addUsersList} />
        </div>
    )
}
