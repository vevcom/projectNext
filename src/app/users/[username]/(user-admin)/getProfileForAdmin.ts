import { readUserProfileAction } from '@/actions/users/read'
import { Session } from '@/auth/Session'
import { userProfileUpdateAuther } from '@/services/users/authers'
import { notFound, redirect } from 'next/navigation'

export type PropTypes = {
    params: {
        username: string
    }
}

/**
 * Wrapper used on all user-admin pages to auth the route and get the profile of the user.
 * @param params - The username of the user to get the profile of. if 'me' is passed,
 * the profile of the current user is returned.
 * @param adminPage - The page that the user is being seen on. Used to rediret if the user is not authorized currently.
 * @returns - The profile being seen and the session of the current user.
*/
export async function getProfileForAdmin({ params }: PropTypes, adminPage: string) {
    const session = await Session.fromNextAuth()
    if (params.username === 'me') {
        if (!session.user) return notFound()
        redirect(`/users/${session.user.username}/${adminPage}`) //This throws.
    }
    userProfileUpdateAuther
        .dynamicFields({ username: params.username })
        .auth(session)
        .requireAuthorized({ returnUrlIfFail: `/users/${params.username}/${adminPage}` })
    const profileRes = await readUserProfileAction(params.username)
    if (!profileRes.success) return notFound()
    const profile = profileRes.data
    return { profile, session }
}
