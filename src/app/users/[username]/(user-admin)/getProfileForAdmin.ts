import { readUserProfileAction } from '@/actions/users/read'
import { Session } from '@/auth/Session'
import { UserAuthers } from '@/services/users/authers'
import { notFound, redirect } from 'next/navigation'

type Params = {
    username: string
}

/**
 * Wrapper used on all user-admin pages to auth the route and get the profile of the user.
 * @param params - The username of the user to get the profile of. if 'me' is passed,
 * the profile of the current user is returned.
 * @param adminPage - The page that the user is being seen on. Used to rediret if the user is not authorized currently.
 * @returns - The profile being seen and the session of the current user.
*/
export async function getProfileForAdmin({ username }: Params, adminPage: string) {
    const session = await Session.fromNextAuth()
    if (username === 'me') {
        if (!session.user) return notFound()
        redirect(`/users/${session.user.username}/${adminPage}`) //This throws.
    }
    UserAuthers.updateProfile
        .dynamicFields({ username })
        .auth(session)
        .requireAuthorized({ returnUrlIfFail: `/users/${username}/${adminPage}` })
    const profileRes = await readUserProfileAction({ username })
    if (!profileRes.success) return notFound()
    const profile = profileRes.data
    return { profile, session }
}
