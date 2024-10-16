import { getProfileForAdmin, type PropTypes } from '@/app/users/[username]/(user-admin)/getProfileForAdmin'

export default async function UserDotAdmin(params: PropTypes) {
    const { profile } = await getProfileForAdmin(params, 'dots')
    return (
        <div>UserDotAdmin</div>
    )
}
