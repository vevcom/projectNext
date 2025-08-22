'use client'
import styles from './MembershipAdminForUser.module.scss'
import Form from '@/components/Form/Form'
import { updateMembershipActiveAction, updateMembershipAdminAcion } from '@/services/groups/memberships/actions'
import { useRouter } from 'next/navigation'
import type { UserPagingReturn } from '@/services/users/Types'
import type { ExpandedGroup } from '@/services/groups/Types'

type PropTypes = {
    user: UserPagingReturn,
    group: ExpandedGroup,
}

export default function MembershipAdminForUser({ user, group }: PropTypes) {
    const { refresh } = useRouter()

    return (
        <div className={styles.MembershipAdminForUser}>
            <p>{user.firstname} {user.lastname}</p>
            <i>{user.username}</i>
            <Form
                submitText="Deaktiver medlemsskap"
                action={updateMembershipActiveAction.bind(null, {
                    groupId: group.id,
                    userId: user.id
                }).bind(null, false)}
                successCallback={refresh}
                key={`Deactivate ${user.id}`}
                closePopUpOnSuccess={`Admin for ${user.id}`}
            />
            <Form
                submitText={user.selectedGroupInfo?.admin ? 'Fjern admin' : 'Gjør til admin'}
                action={updateMembershipAdminAcion.bind(null, {
                    groupId: group.id,
                    userId: user.id
                }).bind(null, !user.selectedGroupInfo?.admin)}
                successCallback={refresh}
                key={`Admin ${user.id}`}
                closePopUpOnSuccess={`Admin for ${user.id}`}
            />
        </div>

    )
}
