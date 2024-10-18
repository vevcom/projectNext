import { getProfileForAdmin, type PropTypes } from '@/app/users/[username]/(user-admin)/getProfileForAdmin'
import Image from '@/components/Image/Image'

export default async function UserSettings(props: PropTypes) {
    const { profile } = await getProfileForAdmin(props, 'settings')

    return (
        <div>
            <h2>Generelle Instillinger</h2>
            <Image width={300} image={profile.user.image} />
        </div>
    )
}
