'use client'
import { useState, useEffect } from 'react'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import styles from './Menu.module.scss'
import { usePathname } from 'next/navigation'

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
    
    //close if user changes page
    const path = usePathname()
    useEffect(() => {
        setIsOpen(false)
    }, [path])

    return (
        <> 
        {

            isOpen ? (
            <>
                <div className={styles.Menu}>
                    <FontAwesomeIcon className={styles.close} icon={faTimes} onClick={() => setIsOpen(false)}/>
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
