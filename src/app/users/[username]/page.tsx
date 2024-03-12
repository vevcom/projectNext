import prisma from '@/prisma'
import { getUser } from '@/auth/user'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { v4 as uuid } from 'uuid'
import { readUser } from '@/actions/users/read'

type PropTypes = {
    params: {
        username: string
    },
}

export default async function User({ params }: PropTypes) {
    const { user } = await getUser({
        required: true,
        returnUrl: `/users/${params.username}`,
    })

    const username = params.username
    const me = params.username === user.username
    // TODO REFACTOR
    const userProfile = readUser({username})

    return (
        <>
            <h1>{`${user.firstname} ${user.lastname}`}</h1>
            <p>{`E-post: '${user.email}'`}</p>
            <p>{`Bruker-ID: ${user.id}`}</p>
            <h2>Tilganger:</h2>
            <ul>
                {me && user.permissions.map(permission => <li key={uuid()}>{permission}</li>)}
            </ul>
            {me && <Link href={`${user.username}/edit`}>Rediger profil</Link>}
            {me && <Link href="/logout">Logg ut</Link>}
        </>
    )
}
