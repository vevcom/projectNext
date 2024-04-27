import prisma from '@/prisma'
import { getUser } from '@/auth/getUser'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { v4 as uuid } from 'uuid'
import { NotificationSettings } from './notificationSettings/notificationsSettings'

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
        <div style={{marginLeft: "2rem"}}>
            <h1>{`${user.firstname} ${user.lastname}`}</h1>
            <p>{`E-post: '${user.email}'`}</p>
            <p>{`Bruker-ID: ${user.id}`}</p>
            <h2>Tillganger:</h2>
            <ul>
                {me && permissions.map(permission => <li key={uuid()}>{permission}</li>)}
            </ul>
            <h2>Grupper:</h2>
            <ul>
                {me && memberships.map(membership => <li key={uuid()}>{membership.groupId}</li>)}
            </ul>
            {me && <Link href="/logout">Logg ut</Link>}

            <NotificationSettings />

        </div>
    )
}
