'use client'
import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import styles from './Menu.module.scss'
import { usePathname } from 'next/navigation'
import useKeyPress from '@/hooks/useKeyPress'
import { NavItem } from './navDef'

type PropTypes = {
    openBtnContent: React.ReactNode,
    items: NavItem[]
}


export default function Menu({ items, openBtnContent } : PropTypes) {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    const closeMenu = () => {
        menuRef.current?.classList.add(styles.closeMenu)
        setTimeout(() => setIsOpen(false), 400)
    }

    //close if user changes page
    const path = usePathname()

    useEffect(() => {
        setIsOpen(false) //should be done with no animation
    }, [path])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && event.target instanceof Node && !menuRef.current.contains(event.target)) {
                closeMenu()
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

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
