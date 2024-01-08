'use client'

import { useContext, useCallback, useEffect, useState } from 'react'
import styles from './PopUp.module.scss'
import Button from '../UI/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import useKeyPress from '@/hooks/useKeyPress'
import { TeleportContext } from '@/context/Teleport'
import { v4 as uuid } from 'uuid'

type PropTypes = {
    children: React.ReactNode,
    showButtonContent: React.ReactNode,
}

export default function PopUp({ children, showButtonContent } : PropTypes) {
    const teleport = useContext(TeleportContext)
    if (!teleport) throw new Error('TeleportContext needed for popups')

    const content = (
        <div className={styles.PopUp}>
            <div>
                <Button className={styles.closeBtn} onClick={teleport.remove}>
                    <FontAwesomeIcon icon={faX} />
                </Button>
                <div className={styles.content}>
                    { children }
                </div>
            </div>
        </div>
    )

    useKeyPress('Escape', teleport.remove)
     
    return (
        <button className={styles.openBtn} onClick={() => teleport.teleport(content)}>
            {showButtonContent}
        </button>
    )
}
