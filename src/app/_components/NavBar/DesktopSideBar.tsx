import styles from './DesktopSideBar.module.scss'
import getNavItems from './navDef'
import NavTooltip from './NavTooltip'
import AdminNav from './AdminNav'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { Profile } from '@/services/users/types'

export type PropTypes = {
    profile: Profile | null
}

export default function DesktopSideBar({ profile }: PropTypes) {
    const user = profile?.user ?? null
    const isLoggedIn = user !== null
    const applicationPeriod = false
    const isAdmin = user?.username === 'harambe'

    const navItems = getNavItems(isLoggedIn, isAdmin, applicationPeriod)

    return (
        <aside className={styles.DesktopSideBar}>
            <nav className={styles.navIcons} aria-label="Desktop navigation">
                {navItems.map((item) => (
                    <NavTooltip key={item.name} content={item.name}>
                        <Link
                            href={item.href}
                            className={styles.navIcon}
                            aria-label={item.name}
                        >
                            <FontAwesomeIcon icon={item.icon} className={styles.icon} />
                        </Link>
                    </NavTooltip>
                ))}
            </nav>
            <AdminNav isAdmin={isAdmin} />
        </aside>
    )
}
