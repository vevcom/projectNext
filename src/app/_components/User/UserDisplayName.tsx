import type { User } from '@/prisma-generated-pn-types'


// TODO: Fix flairs / badges
export default function UserDisplayName({
    user
}: {
    user: Pick<User, 'firstname' | 'lastname'>
}) {
    return <>{user.firstname} {user.lastname}</>
}
