import styles from './layout.module.scss'
import { SessionProvider } from '@/auth/useUser'
import MobileNavBar from '@/components/NavBar/MobileNavBar'
import NavBar from '@/components/NavBar/NavBar'
import Footer from '@/components/Footer/Footer'
import { authOptions } from '@/auth/authoptions'
import EditModeProvider from '@/context/EditMode'
import PopUpProvider from '@/context/PopUp'
import DefaultPermissionsProvider from '@/context/DefaultPermissions'
import { readDefaultPermissionsAction } from '@/actions/permissionRoles/read'
import { Inter } from 'next/font/google'
import React from 'react'
import '@/styles/globals.scss'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { getServerSession } from 'next-auth'
import PwaInstaller from './pwaInstaller'

config.autoAddCss = false

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'projectnext',
    description: '',
    charset: 'utf-8',
}

type PropTypes = {
    children: React.ReactNode
}

export default async function RootLayout({ children }: PropTypes) {
    const session = await getServerSession(authOptions)
    const defaultPermissionsRes = await readDefaultPermissionsAction()
    const defaultPermissions = defaultPermissionsRes.success ? defaultPermissionsRes.data : []

    return (
        <html lang="en">
            <body className={inter.className}>
                <SessionProvider session={session}>
                    <DefaultPermissionsProvider defaultPermissions={defaultPermissions}>
                        <EditModeProvider>
                            <PopUpProvider>
                                <div className={styles.wrapper}>
                                    <div className={styles.navBar}>
                                        <NavBar />
                                    </div>
                                    <div className={styles.content}>
                                        {children}
                                    </div>
                                    <div className={styles.footer}>
                                        <Footer />
                                    </div>
                                    <div className={styles.mobileNavBar}>
                                        <MobileNavBar />
                                    </div>
                                </div>
                            </PopUpProvider>
                        </EditModeProvider>
                    </DefaultPermissionsProvider>
                </SessionProvider>

                <PwaInstaller NODE_ENV={process.env.NODE_ENV} />
            </body>
        </html>
    )
}
