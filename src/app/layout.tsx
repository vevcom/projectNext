import { Inter } from 'next/font/google'

import MobileNavBar from '@/components/NavBar/MobileNavBar'
import NavBar from '@/components/NavBar/NavBar'
import Footer from '@/components/Footer/Footer'

import '@/styles/globals.scss'
import styles from './layout.module.scss'

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'

import { getServerSession } from 'next-auth'
import authOptions from '@/auth'

config.autoAddCss = false

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'projectnext',
    description: '',
    charset: 'utf-8',
}

export default async function RootLayout({ children } : { children: React.ReactNode}) {
    const session = await getServerSession(authOptions)

    return (
        <html lang="en">
            <body className={inter.className}>
                <div className={styles.wrapper}>
                    <div className={styles.navBar}>
                        <NavBar session={session} />
                    </div>
                    <div className={styles.content}>
                        {children}
                    </div>
                    <div className={styles.footer}>
                        <Footer />
                    </div>
                    <div className={styles.mobileNavBar}>
                        <MobileNavBar session={session} />
                    </div>
                </div>
            </body>
        </html>
    )
}
