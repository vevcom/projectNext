'use client'
import styles from './SubPageNavBar.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import type { ReactNode } from 'react'

type SubNavBarItemProps = {
    children?: ReactNode,
    icon?: IconProp,
    href: string
}

export function SubPageNavBarItem({ children, icon, href }:SubNavBarItemProps) {
    const pathname = usePathname()
    const page = pathname.split('/').pop()
    const thisPage = href?.split('/').pop()

    return (
        <div className={styles.linkContainer}>
            <Link href={href} className={styles.link}>
                <div className={`${styles.container} ${page === thisPage ? styles.selected : styles.notSelected}`}>
                    {icon && <FontAwesomeIcon icon={icon} className={styles.icon} />}
                    <p className={styles.text}>{children}</p>
                </div>
            </Link>
        </div>
    )
}

export function SubPageNavBar({ children }: {children: ReactNode}) {
    return (<>
        <div className={styles.navBarContainer}>
            {children}
        </div>
    </>)
}
