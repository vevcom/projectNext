import styles from './UserRow.module.scss'
import type { UserFiltered } from '@/server/users/Types'

type PropTypes = {
    user: UserFiltered
    className?: string
}

export default function UserRow({ user, className }: PropTypes) {
    return (
        <span className={`${styles.UserRow} ${className}`}>
            <p>{user.lastname}, {user.firstname}</p>
            <p>{user.username}</p>
            <p>MTTK</p>
            <p>2</p>
        </span>
    )
}
