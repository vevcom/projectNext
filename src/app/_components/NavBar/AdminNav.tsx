'use client'
import styles from './DesktopSideBar.module.scss'
import NavTooltip from './NavTooltip'
import EditModeNavIcon from './EditModeNavIcon'
import { EditModeContext } from '@/contexts/EditMode'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import { useContext } from 'react'

type PropTypes = {
    isAdmin: boolean
}

/**
 * Renders nothing at all - not even the wrapping nav/background panel -
 * when there's neither an admin link nor an edit-mode icon to show.
 * DesktopSideBar (a server component) only knows isAdmin; whether
 * there's something to edit is only known client-side via
 * EditModeContext, so that decision has to live in a client component.
 */
export default function AdminNav({ isAdmin }: PropTypes) {
    const editModeCtx = useContext(EditModeContext)
    if (!isAdmin && !editModeCtx?.somethingToEdit) return null

    return (
        <nav className={styles.adminNav} aria-label="Admin navigation">
            <EditModeNavIcon className={styles.navIcon} />
            {isAdmin && (
                <NavTooltip content="Admin">
                    <Link href="/admin" className={styles.navIcon} aria-label="Admin">
                        <FontAwesomeIcon icon={faCog} className={styles.icon} />
                    </Link>
                </NavTooltip>
            )}
        </nav>
    )
}
