import RegisterStudentCardButton from './RegisterStudentCardButton'
import { getProfileForAdmin } from '@/app/users/[username]/(user-admin)/getProfileForAdmin'
import Image from '@/components/Image/Image'
import type { PropTypes } from '@/app/users/[username]/page'
import { configureAction } from '@/services/configureAction'
import { readUserAction, updateUserAction } from '@/services/users/actions'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { SEX } from '@prisma/client'
import { notFound, redirect } from 'next/navigation'
import UserSettingsForm from './UserProfileSettingsForm'
import { readUserProfileAction } from '@/services/users/actions'


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
