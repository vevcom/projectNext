import styles from './ProfilePicture.module.scss'
import Image from '@/components/Image/Image'
import type { Image as ImageT } from '@prisma/client'

type PropTypes = {
    profileImage: ImageT,
    width: number,
    className?: string
}

export default function ProfilePicture({ profileImage, width, className }: PropTypes) {
    return (
        <div className={styles.ProfilePicture}>
            <Image className={`${styles.image} ${className ?? ''}`} image={profileImage} width={width}/>
        </div>
    )
}
