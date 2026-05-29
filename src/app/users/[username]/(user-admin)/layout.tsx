import styles from './layout.module.scss'
import { flairAuth } from '@/services/flairs/auth'
import { readUserProfileAction } from '@/services/users/actions'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { ServerSession } from '@/auth/session/ServerSession'
import { SubPageNavBar, SubPageNavBarItem } from '@/components/NavBar/SubPageNavBar/SubPageNavBar'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import {
    faCircleDot,
    faCog,
    faHatWizard,
    faKey,
    faPaperPlane,
    faSwatchbook,
    faUser,
} from '@fortawesome/free-solid-svg-icons'
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
        <PageWrapper title={'Innstillinger'}>
            <div className={styles.userAdminLayout}>
                <i>Bruker Id: {user.id}</i> <br />
                <i>Brukernavn: {user.username}</i>
                <main>
                    {children}
                </main>
                {isOwnProfile && (
                    <SubPageNavBar>
                        <SubPageNavBarItem icon={faUser} href={`/users/${username}`}>
                            Profil
                        </SubPageNavBarItem>
                        <SubPageNavBarItem icon={faCircleDot} href={`/users/${username}/dots`}>
                            Prikker
                        </SubPageNavBarItem>
                        <SubPageNavBarItem icon={faPaperPlane} href={`/users/${username}/notifications`}>
                            Notifikasjoner
                        </SubPageNavBarItem>
                        <SubPageNavBarItem icon={faKey} href={`/users/${username}/permissions`}>
                            Tilganger
                        </SubPageNavBarItem>
                        {canAssignFlairs.authorized && (
                            <SubPageNavBarItem icon={faHatWizard} href={`/users/${username}/flairs`}>
                                Kapper
                            </SubPageNavBarItem>
                        )}
                        <SubPageNavBarItem icon={faSwatchbook} href={`/users/${username}/theme`}>
                            Tema
                        </SubPageNavBarItem>
                        <SubPageNavBarItem icon={faCog} href={`/users/${username}/settings`}>
                            Innstillinger
                        </SubPageNavBarItem>
                    </SubPageNavBar>
                )}
            </div>
        </PageWrapper>
    )
}
