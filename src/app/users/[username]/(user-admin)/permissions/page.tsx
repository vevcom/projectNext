import styles from './page.module.scss'
import Permission from '@/components/Permission/Permission'
import { getProfileForAdmin } from '@/app/users/[username]/(user-admin)/getProfileForAdmin'
import { v4 as uuid } from 'uuid'
import type { PropTypes } from '@/app/users/[username]/page'

export default async function UserSettings({ params }: PropTypes) {
    const { profile } = await getProfileForAdmin(await params, 'permissions')

    return (
        <div className={styles.wrapper}>
            <h2>Tilganger:</h2>
            <p><i>Her ser du hvilke funksjoner brukeren din har tilgang til. Kun administratorere kan endre disse.</i></p>
            <ul>
                {profile.permissions.map(permission =>
                    <Permission key={uuid()} permission={permission} className={styles.permission} />
                )}
            </ul>
            <h2>Grupper ID-er:</h2>
            <p><i>Hvilke grupper du er medlem av avgjør hvilke tilganger du har.</i></p>
            <ul>
                {profile.memberships.map(membership =>
                    <li style={{ listStyleType: 'none' }} key={uuid()}>{membership.groupId}</li>
                )}
            </ul>
        </div>
    )
}
