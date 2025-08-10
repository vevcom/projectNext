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
    subText,
}: {
    user: UserFiltered & {
        image: Image
    },
    className?: string,
    subText?: string,
}) {
    return <Link
        className={`${styles.UserCard} ${className ? className : ''}`}
        href={`/users/${user.username}`}
    >
        <ProfilePicture profileImage={user.image} width={60} />
        <div>
            <h6>
                <UserDisplayName user={user} />
            </h6>
            {subText && <p>{subText}</p>}
        </div>
    </Link>
}
