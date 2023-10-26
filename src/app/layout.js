import { Inter } from 'next/font/google'

import NavBar from '@/components/NavBar/NavBar'
import MobileNavBar from '@/components/NavBar/MobileNavBar'
import Footer from '@/components/Footer/Footer'

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

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={inter.className}>
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
      </body>
    </html>
  )
}
