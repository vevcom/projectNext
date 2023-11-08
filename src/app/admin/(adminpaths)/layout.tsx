'use client'

import Link from 'next/link'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './layout.module.scss'
import { usePathname } from 'next/navigation' 

type PropTypes = { 
    children: React.ReactNode
}
  
export default function RootLayout({ children } : PropTypes) {
    //go back one layer in url
    const pathname = usePathname()
    console.log(pathname?.split('/'))
    const href = "/" + pathname?.split('/').slice(1, -1).join('/') ?? "/admin"
    console.log(href)

    return (
        <div className={styles.wrapper}>
            <Link className={styles.backLink} href={href}>
                <FontAwesomeIcon icon={faArrowLeft} className={styles.icon}/>
            </Link>
            <div className={styles.content}>
                {children}
            </div>
        </div>
    )
}