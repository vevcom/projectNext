import styles from './page.module.scss'
import { getProfile } from '@/app/users/[username]/page'
import { getUser } from '@/auth/getUser'
import Permission from '@/components/Permission/Permission'
import { v4 as uuid } from 'uuid'
import { notFound } from 'next/navigation'
import Link from 'next/link'

type PropTypes = {
    params: {
        username: string
    },
}

export default async function UserSettings({ params }: PropTypes) {
    const { user, permissions } = await getUser({
        shouldRedirect: true,
        returnUrl: `/users/${params.username}/settings`,
        userRequired: params.username === 'me'
    })

    const { profile, me } = await getProfile(user, params.username)

    if (!me && !permissions.includes('USERS_UPDATE')) return notFound()
    console.log(permissions)

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
