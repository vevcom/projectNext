import Flair from '@/components/Flair/Flair'
import type { UserFiltered } from '@/services/users/types'
import styles from './UserDisplayName.module.scss'


// TODO: Fix flairs / badges
export default function UserDisplayName({
    user,
    width,
    asClient
}: {
    user: Pick<UserFiltered, 'firstname' | 'lastname' | 'flairs'>,
    width: number,
    asClient: boolean
}) {
    return <div className={styles.userDisplayName}>
        <span>{user.firstname} {user.lastname}</span>

        {user.flairs.map((flair, index) => (
            <Flair key={index} flair={flair} disableEditor={true} width={width} asClient={asClient} />
        ))}
    </div>
}
