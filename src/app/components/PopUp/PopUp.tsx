'use client'

import { useContext, useCallback, useEffect, useRef } from 'react'
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
    const id = uuid()
    const teleport = useContext(TeleportContext)
    if (!teleport) throw new Error('TeleportContext needed for popups')
    const remover = useCallback(() => teleport.remove(id), [teleport, id]);

    useKeyPress('Escape', () => remover());

    const shower = () => {
        teleport.teleport(
            <div className={styles.PopUp}>
                <div>
                    <Button className={styles.closeBtn} onClick={remover}>
                        <FontAwesomeIcon icon={faX} />
                    </Button>
                    <div className={styles.content}>
                        { children }
                    </div>
                </div>
            </div>
        , id)
    }
     
    return (
        <button className={styles.openBtn} onClick={shower}>
            {showButtonContent}
        </button>
    )
}
