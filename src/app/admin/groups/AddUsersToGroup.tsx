'use client'

import UserList from "@/app/components/User/UserList/UserList"
import styles from './AddUsersToGroup.module.scss'

export default function AddUsersToGroup() {
    return (
        <div className={styles.AddUsersToGroup}>
            <UserList className={styles.addUsersList} />
        </div>
    )
}
