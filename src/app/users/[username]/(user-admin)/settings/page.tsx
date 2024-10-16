import styles from './page.module.scss'
import Permission from '@/components/Permission/Permission'
import { v4 as uuid } from 'uuid'
import Link from 'next/link'
import { getProfileForAdmin, type PropTypes } from '@/app/users/[username]/(user-admin)/getProfileForAdmin'

export default async function UserSettings(props: PropTypes) {
    const { profile } = await getProfileForAdmin(props, 'settings')

    return (
        <div className={styles.wrapper}>
            <Link href={`/users/${profile.user.username}`}>Tilbake</Link>
            <h1>{profile.user.firstname} {profile.user.lastname}</h1>
            <div className={styles.userLinks}>
                <Link href="./notifications">Varslinger</Link>
            </div>
            <p>{`Bruker-ID: ${profile.user.id}`}</p>
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
