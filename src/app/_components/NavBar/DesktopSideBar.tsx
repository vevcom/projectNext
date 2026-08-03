import styles from './DesktopSideBar.module.scss'
import getNavItems from './navDef'
import NavTooltip from './NavTooltip'
import EditModeNavIcon from './EditModeNavIcon'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog } from '@fortawesome/free-solid-svg-icons'
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
            <nav className={styles.adminNav} aria-label="Admin navigation">
                <EditModeNavIcon className={styles.navIcon} />
                <NavTooltip content="Admin">
                    <Link href="/admin" className={styles.navIcon} aria-label="Admin">
                        <FontAwesomeIcon icon={faCog} className={styles.icon} />
                    </Link>
                </NavTooltip>
            </nav>
        </aside>
    )
}
