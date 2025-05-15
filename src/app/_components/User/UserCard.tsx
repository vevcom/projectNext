import UserDisplayName from './UserDisplayName'
import styles from './UserCard.module.scss'
import ProfilePicture from './ProfilePicture'
import Link from 'next/link'
import type { Image } from '@prisma/client'
import type { UserFiltered } from '@/services/users/Types'

// TODO: Make nice and add picture
export default function UserCard({
    user,
    className,
}: {
    user: UserFiltered & {
        image: Image
    },
    className?: string,
}) {
    return <Link
        className={`${styles.UserCard} ${className ? className : ''}`}
        href={`/users/${user.username}`}
    >
        <ProfilePicture profileImage={user.image} width={60} />
        <h6>
            <UserDisplayName user={user} />
        </h6>
    </Link>
}
