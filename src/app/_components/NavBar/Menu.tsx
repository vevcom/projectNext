'use client'
import styles from './Menu.module.scss'
import stylesNav from './NavBar.module.scss'
import stylesMobileNav from './MobileNavBar.module.scss'
import useKeyPress from '@/hooks/useKeyPress'
import useClickOutsideRef from '@/hooks/useClickOutsideRef'
import useOnNavigation from '@/hooks/useOnNavigation'
import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faBars, faTimes, faX} from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import type { NavItem } from './navDef'

type PropTypes = {
    openBtnContext: React.ReactNode,
    items: NavItem[]
}


export default function Menu({ items, openBtnContext }: PropTypes) {
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
                            <FontAwesomeIcon className={styles.close} icon={faTimes} onClick={() => closeMenu(menuRef)}/>
                            <ul>
                                {items.map((item) => (
                                    <div key={item.name}>
                                        <Link href={item.href}>
                                            <FontAwesomeIcon icon={item.icon}/>
                                            {item.name}
                                        </Link>
                                    </div>
                                ))}
                            </ul>
                        </div>
                    </>
                ) : null
            }
            <button className={styles.openBtn} onClick={() => setIsOpen(true)}>
                {openBtnContext === 'mobile' && !isOpen &&
                    <div className={styles.menuBtn}>
                        <FontAwesomeIcon className={stylesMobileNav.icon} icon={faBars}/>
                    </div>
                }
                {openBtnContext === 'mobile' && isOpen &&
                    <div className={styles.menuBtn}>
                        <FontAwesomeIcon className={stylesMobileNav.icon} icon={faX}/>
                    </div>
                }
                {openBtnContext === 'desktop' && !isOpen &&
                    <p className={stylesNav.openMenu}>Mer</p>
                }
                {openBtnContext === 'desktop' && isOpen &&
                    <p className={stylesNav.openMenu}>Mindre</p>
                }


            </button>
        </>
    )
}
