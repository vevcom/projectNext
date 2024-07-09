import { getUser } from '@/auth/getUser'
import { v4 as uuid } from 'uuid'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProfile } from '../page'

type PropTypes = {
    params: {
        username: string
    },
}

export default async function Settings({ params }: PropTypes) {
    const { user, permissions }= await getUser({
        shouldRedirect: true,
        returnUrl: `/users/${params.username}/settings`,
    })

    const { profile, me } = await getProfile(user, params.username)

    //TODO: Either you need to have the USER_UPDATE permission or be the user you are trying to view (me is true)
    if (!me /*&& !permissions.includes('USER_UPDATE')*/) return notFound()
    console.log(permissions)
    
    return (
        <div>
            <Link href={`/users/${profile.user.username}`}>Tilbake</Link>
            <h1>{profile.user.firstname} {profile.user.lastname}</h1>
            <p>{`Bruker-ID: ${profile.user.id}`}</p>
            <h2>Tillganger:</h2>
            <ul>
                {profile.permissions.map(permission => <li key={uuid()}>{permission}</li>)}
            </ul>
            <h2>Grupper:</h2>
            <ul>
                {profile.memberships.map(membership => <li key={uuid()}>{membership.groupId}</li>)}
            </ul>
        </div>
    )
}
