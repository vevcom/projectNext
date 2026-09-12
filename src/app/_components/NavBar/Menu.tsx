'use client'
import styles from './Menu.module.scss'
import stylesNav from './NavBar.module.scss'
import useKeyPress from '@/hooks/useKeyPress'
import useClickOutsideRef from '@/hooks/useClickOutsideRef'
import useOnNavigation from '@/hooks/useOnNavigation'
import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import type { NavItem } from './navDef'

type PropTypes = {
    openBtnVariant: 'mobile' | 'desktop',
    items: NavItem[]
}


export default function Menu({ items, openBtnVariant }: PropTypes) {
    const [isOpen, setIsOpen] = useState(false)
    function closeMenu(ref: React.RefObject<HTMLDivElement | null>) {
        ref?.current?.classList.add(styles.closeMenu)
        setTimeout(() => setIsOpen(false), 400)
    }
    const menuRef = useClickOutsideRef((_, ref) => closeMenu(ref))
    useOnNavigation(() => setIsOpen(false)) //done with no animation
    useKeyPress('Escape', () => closeMenu(menuRef))

    return (
        <>
            {
                isOpen ? (
                    <>
                        <div ref={menuRef} className={styles.Menu}>
                            <div>
                                {items.map((item) => (
                                    <div key={item.name}>
                                        <Link href={item.href}>
                                            <FontAwesomeIcon icon={item.icon}/>
                                            {item.name}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : null
            }
            <button
                className={styles.openBtn}
                onClick={() => (isOpen ? closeMenu(menuRef) : setIsOpen(true))}
            >
                {openBtnVariant === 'mobile' &&
                    <div className={`${styles.menuBtn} ${isOpen ? styles.open : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                }
                {openBtnVariant === 'desktop' && !isOpen &&
                    <p className={stylesNav.openMenu}>Mer</p>
                }
                {openBtnVariant === 'desktop' && isOpen &&
                    <p className={stylesNav.openMenu}>Mindre</p>
                }
            </button>
        </>
    )
}
