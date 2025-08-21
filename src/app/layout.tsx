import styles from './layout.module.scss'
import { SessionProvider } from '@/auth/useUser'
import MobileNavBar from '@/components/NavBar/MobileNavBar'
import NavBar from '@/components/NavBar/NavBar'
import Footer from '@/components/Footer/Footer'
import { authOptions } from '@/auth/authoptions'
import EditModeProvider from '@/contexts/EditMode'
import PopUpProvider from '@/contexts/PopUp'
import DefaultPermissionsProvider from '@/contexts/DefaultPermissions'
import { readDefaultPermissionsAction } from '@/actions/permissions/index'
import { Inter } from 'next/font/google'
import '@/styles/globals.scss'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { getServerSession } from 'next-auth'
import type { ReactNode } from 'react'
import { readUserProfileAction } from '@/actions/users/read'
import { unwrapActionReturn } from './redirectToErrorPage'

config.autoAddCss = false

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'projectnext',
    description: '',
    charset: 'utf-8',
}

type PropTypes = {
    children: ReactNode
}

export default async function RootLayout({ children }: PropTypes) {
    const session = await getServerSession(authOptions)
    const defaultPermissionsRes = await readDefaultPermissionsAction()
    const defaultPermissions = defaultPermissionsRes.success ? defaultPermissionsRes.data : []
    const profile = session?.user ?
        unwrapActionReturn(await readUserProfileAction(session?.user)) : null

    return (
        <html lang="en">
            <body className={`${inter.className} ${styles.body}`}>
                <SessionProvider session={session}>
                    <DefaultPermissionsProvider defaultPermissions={defaultPermissions}>
                        <EditModeProvider>
                            <PopUpProvider>
                                <div className={styles.wrapper}>
                                    <div className={styles.navBar}>
                                        <NavBar profile={profile} />
                                    </div>
                                    <div className={styles.content}>
                                        {children}
                                    </div>
                                    <div className={styles.footer}>
                                        <Footer />
                                    </div>
                                    <div className={styles.mobileNavBar}>
                                        <MobileNavBar profile={profile} />
                                    </div>
                                </div>
                            </PopUpProvider>
                        </EditModeProvider>
                    </DefaultPermissionsProvider>
                </SessionProvider>
            </body>
        </html>
    )
}
