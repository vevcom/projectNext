import styles from './layout.module.scss'
import { unwrapActionReturn } from './redirectToErrorPage'
import { SessionProvider } from '@/auth/session/useSession'
import MobileNavBar from '@/components/NavBar/MobileNavBar'
import { authOptions } from '@/auth/nextAuth/authOptions'
import EditModeProvider from '@/contexts/EditMode'
import PopUpProvider from '@/contexts/PopUp'
import ClientDataProvider from '@/contexts/ClientData'
import { PageTitleProvider } from '@/contexts/PageTitle'
import { readDefaultPermissionsAction } from '@/services/permissions/actions'
import { readAllStandardImagesAction } from '@/services/images/standard/actions'
import { readUserProfileAction } from '@/services/users/actions'
import { ServerSession } from '@/auth/session/ServerSession'
import ThemeEnabler from '@/UI/ThemeEnabler'
import ServiceWorkerRegister from '@/UI/ServiceWorkerRegister'
import DesktopSideBar from '@/components/NavBar/DesktopSideBar'
import { Inter } from 'next/font/google'
import '@/styles/globals.scss'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { getServerSession } from 'next-auth'
import type { ReactNode } from 'react'
import type { Metadata, Viewport } from 'next'
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

export const viewport: Viewport = {
    themeColor: '#037FFC',
}

type PropTypes = {
    children: ReactNode
}

export default async function RootLayout({ children }: PropTypes) {
    const nextAuthSession = await getServerSession(authOptions)
    const serverSession = await ServerSession.fromNextAuth()

    const defaultPermissionsRes = await readDefaultPermissionsAction()
    const defaultPermissions = defaultPermissionsRes.success ? defaultPermissionsRes.data : undefined
    const standardImagesRes = await readAllStandardImagesAction()
    const standardImages = standardImagesRes.success ? standardImagesRes.data : undefined
    const profile = serverSession?.user ?
        unwrapActionReturn(await readUserProfileAction({ params: { username: serverSession.user.username } })) : null

    return (
        <html lang="en">
            <body className={`${inter.className} ${styles.body}`}>
                <ThemeEnabler></ThemeEnabler>
                <ServiceWorkerRegister></ServiceWorkerRegister>
                <SessionProvider session={nextAuthSession}>
                    <ClientDataProvider
                        session={serverSession.toJsObject()}
                        defaultPermissions={defaultPermissions}
                        standardImages={standardImages}
                    >
                        <EditModeProvider>
                            <PopUpProvider>
                                <PageTitleProvider>
                                    <div className={styles.wrapper}>
                                        <div className={styles.navBar}>
                                            <NavBar
                                                profile={profile}
                                            />
                                        </div>
                                        <aside className={styles.sideBar}>
                                            <DesktopSideBar profile={profile} />
                                        </aside>
                                        <main className={styles.content}>
                                            {children}
                                        </main>
                                        <div className={styles.mobileNavBar}>
                                            <MobileNavBar
                                                profile={profile}
                                            />
                                        </div>
                                    </div>
                                </PageTitleProvider>
                            </PopUpProvider>
                        </EditModeProvider>
                    </ClientDataProvider>
                </SessionProvider>
            </body>
        </html>
    )
}
