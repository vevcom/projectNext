import styles from './layout.module.scss'
import { flairAuth } from '@/services/flairs/auth'
import { readUserProfileAction } from '@/services/users/actions'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { ServerSession } from '@/auth/session/ServerSession'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import UserAdminNavBar from '@/app/users/[username]/UserAdminNavBar'
import { notFound } from 'next/navigation'
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

    const canAssignFlairs = flairAuth.assignToUser.dynamicFields({}).auth(session)
    const { user } = unwrapActionReturn(await readUserProfileAction({ params: { username } }))
    const isOwnProfile = user.id === session.user?.id

    return (
        <PageWrapper title={'Innstillinger'} fillHeight transparent hideTitle>
            <div className={styles.userAdminLayout}>
                <main className={styles.main}>
                    <div className={styles.mainInner}>
                        {children}
                    </div>
                </main>
                {isOwnProfile && (
                    <UserAdminNavBar username={username} canAssignFlairs={canAssignFlairs.authorized} />
                )}
            </div>
        </PageWrapper>
    )
}
