import styles from './UserRow.module.scss'
import type { UserPagingReturn } from '@/server/users/Types'

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
            <p>{user.lastname}, {user.firstname}</p>
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
