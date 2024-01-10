'use client'

import { useContext, useEffect, useRef, useState } from 'react'
import styles from './PopUp.module.scss'
import Button from '../UI/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import useKeyPress from '@/hooks/useKeyPress'
import { PopUpContext } from '@/context/PopUp'
import useClickOutsideRef from '@/hooks/useClickOutsideRef'
import useOnNavigation from '@/hooks/useOnNavigation'
import { v4 as uuid } from 'uuid'

type PropTypes = {
    children: React.ReactNode,
    showButtonContent: React.ReactNode,
    showButtonClass?: string,
}

export default function PopUp({ children, showButtonContent, showButtonClass } : PropTypes) {
    const popUpContext = useContext(PopUpContext)
    if (!popUpContext) throw new Error('Pop up context needed for popups')
    const [isOpen, setIsOpen] = useState(false)
    useKeyPress('Escape', () => setIsOpen(false))
    useOnNavigation(() => setIsOpen(false))
    const ref = useClickOutsideRef(() => setIsOpen(false))


    useEffect(() => {
        if (isOpen) {
            popUpContext.teleport(
                <div className={styles.PopUp}>
                    <div ref={ref}>
                        <Button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                            <FontAwesomeIcon icon={faX} />
                        </Button>
                        <div className={styles.content}>
                            { children }
                        </div>
                    </div>
                </div>
            )
        } else {
            popUpContext.remove()
        }
    }, [children, isOpen]);

    return (
        <button className={`${styles.openBtn} ${showButtonClass}`} onClick={() => setIsOpen(true)}>
            {showButtonContent}
        </button>
    )
}
