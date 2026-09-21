'use client'

import styles from './DesktopSideBar.module.scss'
import getNavItems from './navDef'
import SideBarNavItem from './SideBarNavItem'
import AdminNav from './AdminNav'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'

export type PropTypes = {
    // Only the username crosses into this client component: passing the whole profile would
    // serialize the user's email, mobile, bio, memberships and permissions into the payload.
    username: string | null
}

export default function DesktopSideBar({ username }: PropTypes) {
    const [expanded, setExpanded] = useState(false)
    const isLoggedIn = username !== null
    const applicationPeriod = false
    const isAdmin = username === 'harambe'

    const navItems = getNavItems(isLoggedIn, isAdmin, applicationPeriod)
        .filter(item => item.show !== 'admin')
    return (
        <aside className={styles.DesktopSideBar} data-expanded={expanded}>
            <nav className={styles.navIcons} aria-label="Desktop navigation">
                {navItems.map((item) => (
                    <SideBarNavItem key={item.name} item={item} expanded={expanded} />
                ))}
            </nav>
            <AdminNav isAdmin={isAdmin} expanded={expanded} />
            <button
                type="button"
                className={styles.expandToggle}
                onClick={() => setExpanded(prev => !prev)}
                aria-label={expanded ? 'Collapse navigation' : 'Expand navigation'}
            >
                <FontAwesomeIcon icon={expanded ? faChevronLeft : faChevronRight} />
            </button>
        </aside>
    )
}
