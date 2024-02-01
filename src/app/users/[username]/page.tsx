import prisma from '@/prisma'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { requireUser } from '@/auth'

type PropTypes = {
    params: {
        username: string
    },
}

export default async function User({ params }: PropTypes) {
    const user = await requireUser({
        returnUrl: `/users/${params.username}`
    })

    const me = params.username === 'me'
    const username = me ? user.username : params.username

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
            <p>{`E-post: '${user.email}'`}<br/>{`Passord: '${user.password}'`}</p>
            {me && <Link href="/logout">Logg ut</Link>}
        </>
    )
}
