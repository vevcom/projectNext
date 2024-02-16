import { UserFiltered } from '@/actions/users/Types'
import styles from './UserRow.module.scss'

type PropTypes = {
    user: UserFiltered
}

export default function UserRow({ user }: PropTypes) {
    return (
        <tr className={styles.UserRow}>
            <td>{user.lastname}, {user.firstname}</td>
            <td>{user.username}</td>
            <td>MTTK</td>
            <td>2</td>
        </tr>
    )
}
