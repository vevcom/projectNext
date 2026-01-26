import styles from './layout.module.scss'
import Nav from './Nav'
import { readUserProfileAction } from '@/services/users/actions'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { ServerSession } from '@/auth/session/ServerSession'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { ReactNode } from 'react'
import type { PropTypes } from '@/app/users/[username]/page'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Innstillinger',
}

export default async function UserAdmin({ children, params }: PropTypes & { children: ReactNode }) {
    const session = await ServerSession.fromNextAuth()
    let username = (await params).username
    if (username === 'me') {
        if (!session.user) return notFound()
        username = session.user.username
    }
    const { user } = unwrapActionReturn(await readUserProfileAction({ params: { username } }))
    return (
        <PageWrapper title={`Innstillinger for ${user.firstname} ${user.lastname}`}>
            <Link href={`/users/${username}`} className={styles.toProfile}>
                Til Profilsiden
            </Link>
            <div className={styles.userAdminLayout}>
                <i>Bruker Id: {user.id}</i> <br />
                <i>Brukernavn: {user.username}</i>
                <main>
                    {children}
                </main>
                <Nav username={username} />
            </div>
        </PageWrapper>
    )
}
