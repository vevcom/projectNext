import styles from './UserRow.module.scss'
import type { UserFiltered } from '@/server/users/Types'

type PropTypes = {
    user: UserFiltered
}

export default function UserRow({ user }: PropTypes) {
    return (
        <span className={styles.UserRow}>
            <p>{user.lastname}, {user.firstname}</p>
            <p>{user.username}</p>
            <p>MTTK</p>
            <p>2</p>
        </span>
    )
}
