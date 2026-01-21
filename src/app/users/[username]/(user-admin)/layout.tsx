import styles from './layout.module.scss'
import { readUserProfileAction } from '@/services/users/actions'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { ServerSession } from '@/auth/session/ServerSession'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import type { PropTypes } from '@/app/users/[username]/page'
import SubPageNavBar from '@/components/NavBar/SideNavBar/SubPageNavBar'
import SubPageNavBarItem from '@/components/NavBar/SideNavBar/SubPageNavBarItem'
import { faCircleDot, faCog, faKey, faMoneyBill1Wave, faPaperPlane, faUser } from '@fortawesome/free-solid-svg-icons'

export default async function UserAdmin({ children, params }: PropTypes & { children: ReactNode }) {
    const session = await ServerSession.fromNextAuth()
    let username = (await params).username
    if (username === 'me') {
        if (!session.user) return notFound()
        username = session.user.username
    }
    const { user } = unwrapActionReturn(await readUserProfileAction({ params: { username } }))
    const hrefPrefix = `/users/${username}`
    return (
        <PageWrapper title={`Innstillinger for ${user.firstname} ${user.lastname}`}>
            <div className={styles.userAdminLayout}>
                <i>Bruker Id: {user.id}</i> <br />
                <i>Brukernavn: {user.username}</i>
                <main>
                    {children}
                </main>
                <SubPageNavBar>
                    <SubPageNavBarItem icon={faUser} href={hrefPrefix}>Profil</SubPageNavBarItem>
                    <SubPageNavBarItem icon={faCog} href={`${hrefPrefix}/settings`}>Innstillinger</SubPageNavBarItem>
                    <SubPageNavBarItem icon={faPaperPlane} href={`${hrefPrefix}/notifications`}>Notifikasjoner</SubPageNavBarItem>
                    <SubPageNavBarItem icon={faCircleDot} href={`${hrefPrefix}/dots`}>Prikker</SubPageNavBarItem>
                    <SubPageNavBarItem icon={faMoneyBill1Wave} href={`${hrefPrefix}/konto`}>Konto</SubPageNavBarItem>
                    <SubPageNavBarItem icon={faKey} href={`${hrefPrefix}/permissions`}>Tilganger</SubPageNavBarItem>
                </SubPageNavBar>
            </div>
        </PageWrapper>
    )
}
