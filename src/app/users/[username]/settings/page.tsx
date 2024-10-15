import styles from './page.module.scss'
import { getUser } from '@/auth/getUser'
import Permission from '@/components/Permission/Permission'
import { v4 as uuid } from 'uuid'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Session } from '@/auth/Session'
import { readUserProfileAction } from '@/actions/users/read'
import { UserProfileUpdateAuther } from '@/services/users/Authers'

type PropTypes = {
    params: {
        username: string
    },
}

export default async function UserSettings({ params }: PropTypes) {
    const session = await Session.fromNextAuth()
    if (params.username === 'me') {
        if (!session.user) return notFound()
        redirect(`/users/${session.user.username}/settings`) //This throws.
    }
    UserProfileUpdateAuther
        .dynamicFields({ username: params.username })
        .auth(session)
        .requireAuthorized({ returnUrlIfFail: `/users/${params.username}/settings` })
    const profileRes = await readUserProfileAction(params.username)
    if (!profileRes.success) return notFound()
    const profile = profileRes.data

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
