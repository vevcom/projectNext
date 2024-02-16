import { UserFiltered } from '@/actions/users/Types'
import styles from './UserRow.module.scss'

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
