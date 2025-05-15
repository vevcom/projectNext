import styles from './UserRow.module.scss'
import UserDisplayName from '@/components/User/UserDisplayName'
import type { UserPagingReturn } from '@/services/users/Types'

type PropTypes = {
    user: UserPagingReturn
    className?: string
    groupSelected?: boolean
}

export default function UserRow({
    user,
    className,
    groupSelected = false
}: PropTypes) {
    return (
        <span className={`${styles.UserRow} ${className}`}>
            <p><UserDisplayName user={user} /></p>
            <p>{user.username}</p>
            <p>{user.studyProgramme}</p>
            <p>{user.class}</p>
            {
                groupSelected && (<>
                    <p>{user.selectedGroupInfo?.title}</p>
                    <p>{user.selectedGroupInfo?.admin ? 'Ja' : 'Nei'}</p>
                </>)
            }

        </span>
    )
}
