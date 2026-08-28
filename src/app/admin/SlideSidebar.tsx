'use client'
import styles from './SlideSidebar.module.scss'
import useOnNavigation from '@/hooks/useOnNavigation'
import useClickOutsideRef from '@/hooks/useClickOutsideRef'
import useKeyPress from '@/hooks/useKeyPress'
import { adminLinksAuthorizedFor } from '@/components/NavBar/adminNavDef'
import { useSession } from '@/auth/session/useSession'
import { Fragment, useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons'

type PropTypes = {
    currentPath: string
}

/**
 * Component that renders a sidebar that can be toggled on and off.
 * @param children - The children to render in the sidebar.
 * @returns
 */
export default function SlideSidebar({ currentPath }: PropTypes) {
    const [open, setOpen] = useState(currentPath === 'admin')
    const session = useSession()

    useOnNavigation(() => setOpen(currentPath === 'admin'))

    const sidebarRef = useClickOutsideRef(() => setOpen(false))
    useKeyPress('Escape', () => setOpen(false))

    const navigations = session.loading ? [] : adminLinksAuthorizedFor(session.session)

    return <div className={`${styles.SlideSidebar} ${open ? styles.open : ''}`}>
        <div className={styles.backdrop} />
        <div ref={sidebarRef}>
            <button
                type="button"
                className={styles.toggleButton}
                aria-label={open ? 'Lukk meny' : 'Åpne meny'}
                aria-expanded={open}
                onClick={() => setOpen(previousOpen => !previousOpen)}
            >
                <FontAwesomeIcon icon={open ? faXmark : faBars} />
            </button>
            <aside className={styles.sidebar}>
                {
                    navigations.map(navigation => (
                        <Fragment key={navigation.header.title}>
                            <h3>
                                <FontAwesomeIcon icon={navigation.header.icon} />
                                {navigation.header.title}
                            </h3>
                            {
                                navigation.links.map(link => (
                                    <Link
                                        key={link.title}
                                        href={link.href}
                                        className={link.href === `/admin/${currentPath}` ? styles.active : ''}
                                    >
                                        {link.title}
                                    </Link>
                                ))
                            }
                        </Fragment>
                    ))
                }
            </aside>
        </div>
    </div>
}
