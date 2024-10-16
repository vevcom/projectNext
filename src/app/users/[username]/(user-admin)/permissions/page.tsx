import { getProfileForAdmin, type PropTypes } from '@/app/users/[username]/(user-admin)/getProfileForAdmin'

export default async function UserSettings(params: PropTypes) {
    const { profile, session } = await getProfileForAdmin(params, 'permissions')

    return (
        <div>
            <h1>Settings for {profile.user.firstname}</h1>
            <p>Here you can change your settings</p>
        </div>
    )
}
