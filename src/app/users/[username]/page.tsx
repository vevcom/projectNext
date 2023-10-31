import { redirect } from 'next/navigation'
import { getServerSession } from "next-auth";

import authOptions from '@/auth';

import prisma from "@/prisma"
import Link from 'next/link';

type PropTypes = {
    params: {
        username: string
    },
}

async function AuthTest({ params }: PropTypes) {
    if (!params?.username) {
        redirect('/login')
    }
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/login')
    }

    const me = params.username === "me"
    const username = me ? session.user.username : params.username

    const user = await prisma.user.findUnique({
        where: {
            username: username
        }
    })

    if (!user) {
        redirect('/login')
    }

    return (
        <>
            <h1>{`${user.firstname} ${user.lastname}`}</h1>
            <p>{`E-post: '${user.email}'`}<br/>{`Passord: '${user.password}'`}</p>
            {me && <Link href="/logout">Logg ut</Link>}
        </>
    )
}

export default AuthTest 