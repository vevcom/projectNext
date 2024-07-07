import { notFound } from "next/navigation"
import { getUser } from "@/auth/getUser"
import { v4 as uuid } from 'uuid'
import { readPermissionsOfUser } from "@/server/permissionRoles/read"
import { readMembershipsOfUser } from "@/server/groups/read"
import Link from "next/link"

type PropTypes = {
    params: {
        username: string
    },
}

export default async function Settings({ params }: PropTypes) {
    const { user } = await getUser({
        userRequired: true,
        shouldRedirect: true,
        returnUrl: `/users/${params.username}/settings`,
    })

    const me = params.username === 'me'
    const username = me ? user.username : params.username

    const profile = await prisma.user.findUnique({
        where: {
            username
        }
    }) 

    if (!profile) {
        return notFound()
    }

    const permissions = await readPermissionsOfUser(profile.id)
    const memberships = await readMembershipsOfUser(profile.id)

    return (
        <div>
            <Link href={`/users/${username}`}>Tilbake</Link>
            <h1>{profile.firstname} {profile.lastname}</h1> 
            <p>{`Bruker-ID: ${profile.id}`}</p>
            <h2>Tillganger:</h2>
            <ul>
                {permissions.map(permission => <li key={uuid()}>{permission}</li>)}
            </ul>
            <h2>Grupper:</h2>
            <ul>
                {memberships.map(membership => <li key={uuid()}>{membership.groupId}</li>)}
            </ul>
        </div>
    )
}
