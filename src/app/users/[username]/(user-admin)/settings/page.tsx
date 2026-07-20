import UserSettingsForm from './UserProfileSettingsForm'
import UserProfileSettingsCard from './UserProfileSettingsCard'
import { getProfileForAdmin } from '@/app/users/[username]/(user-admin)/getProfileForAdmin'
import Image from '@/components/Image/Image'
import ImageUploader from '@/components/Image/ImageUploader'
import { readUserProfileAction, updateUserProfileImageAction } from '@/services/users/actions'
import { userAuth } from '@/services/users/auth'
import { configureAction } from '@/services/configureAction'
import { notFound } from 'next/navigation'
import type { PropTypes } from '@/app/users/[username]/page'

export default async function UserSettings({ params }: PropTypes) {
    const { profile, session } = await getProfileForAdmin(await params, 'settings')
    const profileRes = await readUserProfileAction({ params: { username: (await params).username } })
    if (!profileRes.success) return notFound()
    const userDataFull = profileRes.data.user

    const canUpdateImage = userAuth.updateProfileImage.dynamicFields({
        username: profile.user.username
    }).auth(session).toJsObject()

    return (
        <div>
            <UserProfileSettingsCard>
                <UserSettingsForm user={userDataFull} />
            </UserProfileSettingsCard>
            {/* TODO: add Email registration form and admin user settings */}
            <UserProfileSettingsCard>
                <h2>Generelle Instillinger</h2>
                <ImageUploader
                    popUpKey={`EditProfileImage${profile.user.id}`}
                    canEdit={canUpdateImage}
                    uploadImageAction={configureAction(
                        updateUserProfileImageAction,
                        { params: { username: profile.user.username } }
                    )}
                />
                <Image width={300} image={profile.user.image} />
            </UserProfileSettingsCard>
        </div>
    )
}
