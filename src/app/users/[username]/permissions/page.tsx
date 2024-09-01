import { getUser } from '@/auth/getUser'
import { getProfile } from '@/app/users/[username]/page'

type PropTypes = {
    params: {
        username: string
    }
}

export default async function UserSettings({ params }: PropTypes) {
    const { user } = await getUser({
        shouldRedirect: true,
        returnUrl: `/users/${params.username}/settings`,
        userRequired: params.username === 'me'
    })

    const { profile } = await getProfile(user, params.username)

    return (
        <div>
            <h1>Settings for {profile.user.firstname}</h1>
            <p>Here you can change your settings</p>
        </div>
    )
}
