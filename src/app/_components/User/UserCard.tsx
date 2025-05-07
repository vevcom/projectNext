import UserDisplayName from './UserDisplayName'
import styles from './UserCard.module.scss'
import type { UserFiltered } from '@/services/users/Types'
import Link from 'next/link'

// TODO: Make nice and add picture
export default function UserCard({
    user,
    className,
}: {
    user: UserFiltered,
    className?: string,
}) {
    return <Link
        className={`${styles.UserCard} ${className ? className : ''}`}
        href={`/users/${user.username}`}
    >
        <h6>
            <UserDisplayName user={user} />
        </h6>

        {user.username}
    </Link>
}
