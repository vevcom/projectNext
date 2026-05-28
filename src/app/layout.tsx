import styles from './layout.module.scss'
import { unwrapActionReturn } from './redirectToErrorPage'
import { SessionProvider } from '@/auth/session/useSession'
import MobileNavBar from '@/components/NavBar/MobileNavBar'
import { authOptions } from '@/auth/nextAuth/authOptions'
import EditModeProvider from '@/contexts/EditMode'
import PopUpProvider from '@/contexts/PopUp'
import DefaultPermissionsProvider from '@/contexts/DefaultPermissions'
import { PageTitleProvider } from '@/contexts/PageTitle'
import { readDefaultPermissionsAction } from '@/services/permissions/actions'
import { readUserProfileAction } from '@/services/users/actions'
import { frontpageAuth } from '@/services/frontpage/auth'
import { ServerSession } from '@/auth/session/ServerSession'
import ThemeEnabler from '@/UI/ThemeEnabler'
import DesktopSideBar from '@/components/NavBar/DesktopSideBar'
import { Inter } from 'next/font/google'
import '@/styles/globals.scss'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { getServerSession } from 'next-auth'
import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import NavBar from '@/components/NavBar/NavBar'

config.autoAddCss = false

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: {
        default: 'Sct. Omega Broderskab',
        template: '%s | Sct. Omega Broderskab',
    },
    description: 'Hjemmesiden for linjeforeningen Sanctus Omega Broderskab ved NTNU.',
    keywords: ['Sanctus Omega Broderskab', 'Sct. Omega Broderskab', 'Sanctus Omega', 'Sct. Omega', 'Omega'],
}

type PropTypes = {
    children: ReactNode
}

export default async function RootLayout({ children }: PropTypes) {
    const session = await getServerSession(authOptions)
    const defaultPermissionsRes = await readDefaultPermissionsAction()
    const defaultPermissions = defaultPermissionsRes.success ? defaultPermissionsRes.data : []
    const profile = session?.user ?
        unwrapActionReturn(await readUserProfileAction({ params: { username: session.user.username } })) : null

    const canEditSpecialCmsImage = frontpageAuth.updateSpecialCmsImage.dynamicFields({}).auth(
        await ServerSession.fromNextAuth()
    ).toJsObject()

    return (
        <html lang="en">
            <body className={`${inter.className} ${styles.body}`}>
                <ThemeEnabler></ThemeEnabler>
                <SessionProvider session={session}>
                    <DefaultPermissionsProvider defaultPermissions={defaultPermissions}>
                        <EditModeProvider>
                            <PopUpProvider>
                                <PageTitleProvider>
                                    <div className={styles.wrapper}>
                                        <div className={styles.navBar}>
                                            <NavBar
                                                profile={profile}
                                                canEditSpecialCmsImage={canEditSpecialCmsImage}
                                            />
                                        </div>
                                        <aside className={styles.sideBar}>
                                            <DesktopSideBar />
                                        </aside>
                                        <main className={styles.content}>
                                            {children}
                                        </main>
                                        <div className={styles.mobileNavBar}>
                                            <MobileNavBar
                                                profile={profile}
                                                canEditSpecialCmsImage={canEditSpecialCmsImage}
                                            />
                                        </div>
                                    </div>
                                </PageTitleProvider>
                            </PopUpProvider>
                        </EditModeProvider>
                    </DefaultPermissionsProvider>
                </SessionProvider>
            </body>
        </html>
    )
}
