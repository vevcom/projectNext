'use client'

import { useContext, useCallback, useEffect, useState } from 'react'
import styles from './PopUp.module.scss'
import Button from '../UI/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import useKeyPress from '@/hooks/useKeyPress'
import { PopUpContext } from '@/context/PopUp'
import useClickOutsideRef from '@/hooks/useclickOutsideRef'
import useOnNavigation from '@/hooks/useOnNavigation'

type PropTypes = {
    children: React.ReactNode,
    showButtonContent: React.ReactNode,
    showButtonClass?: string,
}

export default function PopUp({ children, showButtonContent, showButtonClass } : PropTypes) {
    const popUpContext = useContext(PopUpContext)
    if (!popUpContext) throw new Error('Pop up context needed for popups')

    useKeyPress('Escape', popUpContext.remove)
    useOnNavigation(popUpContext.remove)
    const ref = useClickOutsideRef(popUpContext.remove)

    const content = (
        <div className={styles.PopUp}>
            <div ref={ref}>
                <Button className={styles.closeBtn} onClick={popUpContext.remove}>
                    <FontAwesomeIcon icon={faX} />
                </Button>
                <div className={styles.content}>
                    { children }
                </div>
            </div>
        </div>
    )
     
    return (
        <button className={`${styles.openBtn} ${showButtonClass}`} onClick={() => popUpContext.teleport(content)}>
            {showButtonContent}
        </button>
    )
}
