import styles from './layout.module.scss'
import Nav from './Nav'
import { Session } from '@/auth/session/Session'
import { readUserProfileAction } from '@/services/users/actions'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { ReactNode } from 'react'
import type { PropTypes } from '@/app/users/[username]/page'

export default async function UserAdmin({ children, params }: PropTypes & { children: ReactNode }) {
    const session = await Session.fromNextAuth()
    let username = (await params).username
    if (username === 'me') {
        if (!session.user) return notFound()
        username = session.user.username
    }
    const { user } = unwrapActionReturn(await readUserProfileAction({ username }))
    return (
        <PageWrapper title={`${user.firstname} ${user.lastname} Admin`}>
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
