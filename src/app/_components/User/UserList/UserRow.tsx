import UserDisplayName from '@/components/User/UserDisplayName'
import type { UserPagingReturn } from '@/services/users/types'

type PropTypes = {
    user: UserPagingReturn
    groupSelected?: boolean,
}

export default function UserRow({ user, groupSelected = false }: PropTypes) {
    return (
        <>
            <td><UserDisplayName width={16} user={user} /></td>
            <td>{user.username}</td>
            <td>{user.studyProgramme}</td>
            <td>{user.class}</td>
            {
                groupSelected && (<>
                    <td>{user.selectedGroupInfo?.title}</td>
                    <td>{user.selectedGroupInfo?.admin ? 'Ja' : 'Nei'}</td>
                </>)
            }
        </>
    )
}
