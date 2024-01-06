'use client'
import { useState } from 'react'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import styles from './Menu.module.scss'

type PropTypes = {
    openBtnContent: React.ReactNode,
    items: {
        name: string,
        href: string,
        icon: IconDefinition
    }[]
}


export default function Menu({ items, openBtnContent } : PropTypes) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        isOpen ? (
            <div className={styles.menu}>
                <FontAwesomeIcon icon={faTimes} onClick={() => setIsOpen(false)}/>
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
        ) : (
            <button className={styles.openBtn} onClick={() => setIsOpen(true)}>
                {openBtnContent}
            </button>
        )
    )
}
