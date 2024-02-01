import MobileNavBar from '@/components/NavBar/MobileNavBar'
import NavBar from '@/components/NavBar/NavBar'
import Footer from '@/components/Footer/Footer'
import { getUser } from '@/auth'
import EditModeProvider from '@/context/EditMode'
import PopUpProvider from '@/context/PopUp'
import { Inter } from 'next/font/google'
import React from 'react'
import '@/styles/globals.scss'
import styles from './layout.module.scss'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'

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

export default async function RootLayout({ children } : PropTypes) {
    const user = await getUser()

    return (
        <html lang="en">
            <body className={inter.className}>
                <EditModeProvider>
                    <PopUpProvider>
                        <div className={styles.wrapper}>
                            <div className={styles.navBar}>
                                <NavBar user={user} />
                            </div>
                            <div className={styles.content}>
                                {children}
                            </div>
                            <div className={styles.footer}>
                                <Footer />
                            </div>
                            <div className={styles.mobileNavBar}>
                                <MobileNavBar user={user} />
                            </div>
                        </div>
                    </PopUpProvider>
                </EditModeProvider>
            </body>
        </html>
    )
}
