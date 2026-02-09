import styles from './layout.module.scss'
import { SessionProvider } from '@/auth/session/useSession'
import MobileNavBar from '@/components/NavBar/MobileNavBar'
import NavBar from '@/components/NavBar/NavBar'
import Footer from '@/components/Footer/Footer'
import { authOptions } from '@/auth/nextAuth/authOptions'
import EditModeProvider from '@/contexts/EditMode'
import PopUpProvider from '@/contexts/PopUp'
import DefaultPermissionsProvider from '@/contexts/DefaultPermissions'
import { readDefaultPermissionsAction } from '@/services/permissions/actions'
import { Inter } from 'next/font/google'
import '@/styles/globals.scss'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { getServerSession } from 'next-auth'
import type { ReactNode } from 'react'
import { readUserProfileAction } from '@/services/users/actions'
import { unwrapActionReturn } from './redirectToErrorPage'
import { frontpageAuth } from '@/services/frontpage/auth'
import { ServerSession } from '@/auth/session/ServerSession'
import type { Metadata } from 'next'

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
                <SessionProvider session={session}>
                    <DefaultPermissionsProvider defaultPermissions={defaultPermissions}>
                        <EditModeProvider>
                            <PopUpProvider>
                                <div className={styles.wrapper}>
                                    <div className={styles.navBar}>
                                        <NavBar profile={profile} canEditSpecialCmsImage={canEditSpecialCmsImage} />
                                    </div>
                                    <div className={styles.content}>
                                        {children}
                                    </div>
                                    <div className={styles.footer}>
                                        <Footer canEditSpecialCmsImage={canEditSpecialCmsImage} />
                                    </div>
                                    <div className={styles.mobileNavBar}>
                                        <MobileNavBar profile={profile} canEditSpecialCmsImage={canEditSpecialCmsImage} />
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
