import styles from './UserCard.module.scss'
import ProfilePicture from './ProfilePicture'
import Link from 'next/link'
import type { Image } from '@prisma/client'

export default function ContactCard({
    name,
    image,
    className,
}: {
    name: string,
    image: Image
    className?: string,
}) {
    return <Link
        className={`${styles.UserCard} ${className ? className : ''}`}
        href="#"
    >
        <ProfilePicture profileImage={image} width={60} />
        <h6>{name}</h6>
    </Link>
}
