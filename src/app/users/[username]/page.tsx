import prisma from '@/prisma'
import { getUser } from '@/auth/getUser'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { v4 as uuid } from 'uuid'

type PropTypes = {
    params: {
        username: string
    },
}

export default async function User({ params }: PropTypes) {
    const { user } = await getUser({
        userRequired: true,
        shouldRedirect: true,
        returnUrl: `/users/${params.username}`,
    })

    const me = params.username === 'me'
    const username = me ? user.username : params.username

    // TODO REFACTOR
    const userProfile = await prisma.user.findUnique({
        where: {
            username
        }
    })

    if (!userProfile) {
        notFound()
    }

    return (
        <>
            <h1>{`${user.firstname} ${user.lastname}`}</h1>
            <p>{`E-post: '${user.email}'`}</p>
            <p>{`Bruker-ID: ${user.id}`}</p>
            <h2>Tillganger:</h2>
            <ul>
                {me && user.permissions.map(permission => <li key={uuid()}>{permission}</li>)}
            </ul>
            {me && <Link href="/logout">Logg ut</Link>}
        </>
    )
}
