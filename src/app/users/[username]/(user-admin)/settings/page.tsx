import RegisterStudentCardButton from './RegisterStudentCardButton'
import UserSettingsForm from './UserProfileSettingsForm'
import { getProfileForAdmin } from '@/app/users/[username]/(user-admin)/getProfileForAdmin'
import Image from '@/components/Image/Image'
import { readUserProfileAction } from '@/services/users/actions'
import { notFound } from 'next/navigation'
import type { PropTypes } from '@/app/users/[username]/page'


export default async function UserSettings({ params }: PropTypes) {
    const { profile } = await getProfileForAdmin(await params, 'settings')
    const profileRes = await readUserProfileAction({ params: { username: (await params).username } })
    if (!profileRes.success) return notFound()
    const userDataFull = profileRes.data.user

    return (
        <div>
            <UserSettingsForm userData={userDataFull} />
            {/* TODO: add Email registration form and admin user settings */},.
            <h2>Generelle Instillinger</h2>
            <Image width={300} image={profile.user.image} />
            <RegisterStudentCardButton userId={profile.user.id} />
        </div>
    )
}
