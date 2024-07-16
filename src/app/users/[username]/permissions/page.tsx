import { getUser } from "@/auth/getUser"
import { getProfile } from '@/app/users/[username]/page'

export default async function UserSettings({ params }: PropTypes) {
    const { user, permissions } = await getUser({
        shouldRedirect: true,
        returnUrl: `/users/${params.username}/settings`,
        userRequired: params.username === 'me'
    })

    const { profile, me } = await getProfile(user, params.username)

    const 

    return (
        <div>

        </div>
    )
}