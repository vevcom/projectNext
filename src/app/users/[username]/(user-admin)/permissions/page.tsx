import styles from './page.module.scss'
import Permission from '@/components/Permission/Permission'
import { getProfileForAdmin } from '@/app/users/[username]/(user-admin)/getProfileForAdmin'
import { v4 as uuid } from 'uuid'
import type { PropTypes } from '@/app/users/[username]/page'

export default async function UserSettings({ params }: PropTypes) {
    const { profile } = await getProfileForAdmin(await params, 'permissions')

    return (
        <div className={styles.wrapper}>
            <h2>Tillganger:</h2>
            <ul>
                {profile.permissions.map(permission =>
                    <Permission key={uuid()} permission={permission} className={styles.permission} />
                )}
            </ul>
            <h2>Grupper:</h2>
            <ul>
                {profile.memberships.map(membership => <li key={uuid()}>{membership.groupId}</li>)}
            </ul>
        </div>
    )
}
