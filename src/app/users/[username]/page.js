import { redirect } from 'next/navigation'
import { getServerSession } from "next-auth";

import authOptions from '@/auth';

import prisma from "@/prisma"
import Link from 'next/link';

async function AuthTest({ params }) {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/login')
    }

    const me = params.username === "me"
    let username = me ? session.user.username : params.username

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