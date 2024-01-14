'use client'
import styles from './Menu.module.scss'
import { NavItem } from './navDef'
import useKeyPress from '@/hooks/useKeyPress'
import useClickOutsideRef from '@/hooks/useClickOutsideRef'
import useOnNavigation from '@/hooks/useOnNavigation'
import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

type PropTypes = {
    openBtnContent: React.ReactNode,
    items: NavItem[]
}


export default function Menu({ items, openBtnContent } : PropTypes) {
    const [isOpen, setIsOpen] = useState(false)
    let menuRef : React.RefObject<HTMLDivElement> | null = null
    function closeMenu() {
        menuRef?.current?.classList.add(styles.closeMenu)
        setTimeout(() => setIsOpen(false), 400)
    }
    menuRef = useClickOutsideRef(closeMenu)
    useOnNavigation(() => setIsOpen(false)) //done with no animation
    useKeyPress('Escape', closeMenu)

    return (
        <>
            {
                isOpen ? (
                    <>
                        <div ref={menuRef} className={styles.Menu}>
                            <FontAwesomeIcon className={styles.close} icon={faTimes} onClick={closeMenu}/>
                            <ul>
                                {items.map((item) => (
                                    <li key={item.name}>
                                        <Link href={item.href}>
                                            <FontAwesomeIcon icon={item.icon}/>
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                ) : null
            }
            <button className={styles.openBtn} onClick={() => setIsOpen(true)}>
                {openBtnContent}
            </button>
        </>
    )
}
