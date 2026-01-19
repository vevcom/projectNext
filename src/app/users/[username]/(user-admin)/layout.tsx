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
import SubPageNavBar from '@/components/NavBar/SideNavBar/SubPageNavBar'
import SubPageNavBarItem from '@/components/NavBar/SideNavBar/SubPageNavBarItem'
import { faCircleDot, faCog, faKey, faPaperPlane, faUser } from '@fortawesome/free-solid-svg-icons'

export default async function UserAdmin({ children, params }: PropTypes & { children: ReactNode }) {
    const session = await Session.fromNextAuth()
    let username = (await params).username
    if (username === 'me') {
        if (!session.user) return notFound()
        username = session.user.username
    }
    const { user } = unwrapActionReturn(await readUserProfileAction({ params: { username } }))
    return (
        <PageWrapper title={`Innstillinger for ${user.firstname} ${user.lastname}`}>
            <div className={styles.userAdminLayout}>
                <i>Bruker Id: {user.id}</i> <br />
                <i>Brukernavn: {user.username}</i>
                <main>
                    {children}
                </main>
                {/* <Nav username={username} /> */}
                <SubPageNavBar>
                    <SubPageNavBarItem icon={faUser} href={`/users/${username}`}>Profil</SubPageNavBarItem>
                    <SubPageNavBarItem icon={faCircleDot} href={`/user/${username}/dots`}>Prikker</SubPageNavBarItem>
                    <SubPageNavBarItem icon={faPaperPlane} href={`/users/${username}/notifications`}>Notifikasjoner</SubPageNavBarItem>
                    <SubPageNavBarItem icon={faKey} href={`/users/${username}/permissions`}>Tilganger</SubPageNavBarItem>
                    <SubPageNavBarItem icon={faCog} href={`/users/${username}/settings`}>Innstillinger</SubPageNavBarItem>
                </SubPageNavBar>
            </div>
        </PageWrapper>
    )
}
