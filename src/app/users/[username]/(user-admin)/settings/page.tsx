import RegisterStudentCardButton from './RegisterStudentCardButton'
import { getProfileForAdmin } from '@/app/users/[username]/(user-admin)/getProfileForAdmin'
import type { PropTypes } from '@/app/users/[username]/page'
import Image from '@/components/Image/Image'

export default async function UserSettings({ params }: PropTypes) {
    const { profile } = await getProfileForAdmin(await params, 'settings')

    return (
        <div>
            <h2>Generelle Instillinger</h2>
            <Image width={300} image={profile.user.image} />
            <RegisterStudentCardButton userId={profile.user.id} />
        </div>
    )
}
