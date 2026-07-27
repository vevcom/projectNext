import styles from './UserDisplayName.module.scss'
import Flair from '@/components/Flair/Flair'
import type { UserFiltered } from '@/services/users/types'


// TODO: Fix flairs / badges
export default function UserDisplayName({
    user,
    width,
}: {
    user: Pick<UserFiltered, 'firstname' | 'lastname' | 'flairs'>,
    width: number,
}) {
    return <div className={styles.userDisplayName}>
        <span>{user.firstname} {user.lastname}</span>

        {user.flairs.map((flair, index) => (
            <Flair key={index} flair={flair} width={width} />
        ))}
    </div>
}
