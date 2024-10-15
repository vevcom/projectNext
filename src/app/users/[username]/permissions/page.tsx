import { readUserProfileAction } from '@/actions/users/read'
import { Session } from '@/auth/Session'
import { UserProfileUpdateAuther } from '@/services/users/Authers'
import { notFound, redirect } from 'next/navigation'

type PropTypes = {
    params: {
        username: string
    }
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
        <div>
            <h1>Settings for {profile.user.firstname}</h1>
            <p>Here you can change your settings</p>
        </div>
    )
}
