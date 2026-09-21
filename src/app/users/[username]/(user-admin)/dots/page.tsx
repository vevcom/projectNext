import UserDotsInEditMode from './UserDotsInEditMode'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { getProfileForAdmin } from '@/app/users/[username]/(user-admin)/getProfileForAdmin'
import { readDotsForUserAction } from '@/services/dots/actions'

type PropTypes = {
    params: Promise<{
        username: string
    }>
}

export default async function UserDotAdmin({ params }: PropTypes) {
    const { profile } = await getProfileForAdmin(await params, 'dots')
    const dots = unwrapActionReturn(
        await readDotsForUserAction({ params: { userId: profile.user.id } })
    )

    return (
        <div>
            <h2>Prikker</h2>
            <UserDotsInEditMode userId={profile.user.id} dots={dots} />
        </div>
    )
}
