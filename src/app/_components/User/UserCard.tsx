import UserDisplayName from './UserDisplayName'
import styles from './UserCard.module.scss'
import ProfilePicture from './ProfilePicture'
import Link from 'next/link'
import type { CSSProperties } from 'react'
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
    const [topFlair] = [...user.flairs].sort((flairA, flairB) => flairA.rank - flairB.rank)

    return <Link
        className={`${styles.UserCard} ${className ? className : ''}`}
        href={`/users/${user.username}`}
        style={topFlair ? {
            '--flairColor': `rgb(${topFlair.colorR}, ${topFlair.colorG}, ${topFlair.colorB})`,
        } as CSSProperties : undefined}
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
