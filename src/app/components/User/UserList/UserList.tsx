import styles from './UserList.module.scss'
import { UserPagingContext } from '@/context/paging/UserPaging'
import { useContext } from 'react'

export default function UserList({  }) {
    const userPaging = useContext(UserPagingContext)
    if (!userPaging) throw new Error('UserPagingContext not found')

    return (
        <div className={styles.UserList}>
        {userPaging.state.data.map(user => (
            <div key={user.id}>{user.username}</div>
        ))}
        </div>
    )
}
