import UserDisplayName from './UserDisplayName'
import styles from './UserCard.module.scss'
import ProfilePicture from './ProfilePicture'
import Link from 'next/link'
import type { Image } from '@/prisma-generated-pn-types'
import type { UserFiltered } from '@/services/users/types'

// TODO: Make nice and add picture
export default function UserCard({
    user,
    className,
    subText,
    asClient,
}: {
    user: UserFiltered & {
        image: Image
    },
    className?: string,
    subText?: string,
    asClient: boolean
}) {
    return <Link
        className={`${styles.UserCard} ${className ? className : ''}`}
        href={`/users/${user.username}`}
    >
        <ProfilePicture profileImage={user.image} width={60} />
        <div>
            <h6>
                <UserDisplayName user={user} width={18} asClient={asClient}/>
            </h6>
            {subText && <p>{subText}</p>}
        </div>
    </Link>
}
