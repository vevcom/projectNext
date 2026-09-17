'use client'

import styles from './DesktopSideBar.module.scss'
import NavTooltip from './NavTooltip'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { NavItem } from './navDef'

type PropTypes = {
    item: NavItem
    expanded: boolean
}

export default function SideBarNavItem({ item, expanded }: PropTypes) {
    const link = (
        <Link href={item.href} className={styles.navIcon} aria-label={item.name}>
            <FontAwesomeIcon icon={item.icon} className={styles.icon} />
            <span className={styles.label}>{item.name}</span>
        </Link>
    )

    if (expanded) return link

    return <NavTooltip content={item.name}>{link}</NavTooltip>
}
