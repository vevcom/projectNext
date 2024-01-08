'use client'

import { useContext, useCallback, useEffect, useState } from 'react'
import styles from './PopUp.module.scss'
import Button from '../UI/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import useKeyPress from '@/hooks/useKeyPress'
import { PopUpContext } from '@/context/PopUp'

type PropTypes = {
    children: React.ReactNode,
    showButtonContent: React.ReactNode,
}

export default function PopUp({ children, showButtonContent } : PropTypes) {
    const popUpContext = useContext(PopUpContext)
    if (!popUpContext) throw new Error('Pop up context needed for popups')

    const content = (
        <div className={styles.PopUp}>
            <div>
                <Button className={styles.closeBtn} onClick={popUpContext.remove}>
                    <FontAwesomeIcon icon={faX} />
                </Button>
                <div className={styles.content}>
                    { children }
                </div>
            </div>
        </div>
    )

    useKeyPress('Escape', popUpContext.remove)
     
    return (
        <button className={styles.openBtn} onClick={() => popUpContext.teleport(content)}>
            {showButtonContent}
        </button>
    )
}
