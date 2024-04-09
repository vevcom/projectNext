import prisma from '@/prisma'
import { getUser } from '@/auth/getUser'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { v4 as uuid } from 'uuid'
import { readUserAction } from '@/actions/users/read'

type PropTypes = {
    params: {
        username: string
    },
}

export default async function User({ params }: PropTypes) {
    const { user, permissions, memberships } = await getUser({
        userRequired: true,
        shouldRedirect: true,
        returnUrl: `/users/${params.username}`,
    })

    const username = params.username
    const me = params.username === user.username
    // TODO REFACTOR
    const userProfile = readUserAction({username})

    return (
        <>
            <h1>{`${user.firstname} ${user.lastname}`}</h1>
            <p>{`E-post: '${user.email}'`}</p>
            <p>{`Bruker-ID: ${user.id}`}</p>
            <h2>Tilganger:</h2>
            <ul>
                {me && permissions.map(permission => <li key={uuid()}>{permission}</li>)}
            </ul>
            <h2>Grupper:</h2>
            <ul>
                {me && memberships.map(membership => <li key={uuid()}>{membership.groupId}</li>)}
            </ul>
            {me && <Link href={`${user.username}/edit`}>Rediger profil</Link>}
            {me && <Link href="/logout">Logg ut</Link>}
        </>
    )
}
