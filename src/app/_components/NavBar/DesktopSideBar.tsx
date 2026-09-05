'use client'

import styles from './DesktopSideBar.module.scss'
import getNavItems from './navDef'
import SideBarNavItem from './SideBarNavItem'
import AdminNav from './AdminNav'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import type { Profile } from '@/services/users/types'

export type PropTypes = {
    profile: Profile | null
}

export default function DesktopSideBar({ profile }: PropTypes) {
    const [expanded, setExpanded] = useState(false)
    const user = profile?.user ?? null
    const isLoggedIn = user !== null
    const applicationPeriod = false
    const isAdmin = user?.username === 'harambe'

    const navItems = getNavItems(isLoggedIn, isAdmin, applicationPeriod)

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
