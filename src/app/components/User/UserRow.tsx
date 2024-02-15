import { UserFiltered } from '@/actions/users/Types'
import styles from './UserRow.module.scss'

type PropTypes = {
    user: UserFiltered
}

export default function UserRow({ user }: PropTypes) {
    return (
        <div className={styles.UserRow}>
            UserListRow
        </div>
    )
}
