'use client'
import styles from './PopUp.module.scss'
import useKeyPress from '@/hooks/useKeyPress'
import { PopUpContext } from '@/contexts/PopUp'
import useClickOutsideRef from '@/hooks/useClickOutsideRef'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'
import { useContext, useEffect, useState, useRef, useCallback, useEffectEvent } from 'react'
import type { ReactNode, CSSProperties } from 'react'
import type { PopUpKeyType } from '@/contexts/PopUp'

export type PropTypes = {
    children: ReactNode,
    showButtonContent: ReactNode,
    showButtonClass?: string,
    popUpKey: PopUpKeyType,
    showButtonStyle?: CSSProperties,
}

export default function PopUp({
    popUpKey,
    children,
    showButtonContent,
    showButtonClass,
    showButtonStyle,
}: PropTypes) {
    const [isOpen, setIsOpen] = useState(false)

    const popUpContext = useContext(PopUpContext)
    useKeyPress('Escape', () => setIsOpen(false))
    const ref = useClickOutsideRef(() => setIsOpen(false))
    const contentRef = useRef<ReactNode>(null)

    if (!popUpContext) throw new Error('Pop up context needed for popups')

    const { teleport, remove, keyOfCurrentNode } = popUpContext

    const handleTeleportOrRemove = useEffectEvent(() => {
        if (isOpen) {
            teleport(contentRef.current, popUpKey)
        } else {
            remove(popUpKey)
        }
    })

    useEffect(() => {
        handleTeleportOrRemove()
    }, [isOpen, popUpKey])

    const handleCloseIfNotCurrent = useEffectEvent(() => {
        if (popUpContext.keyOfCurrentNode !== popUpKey) {
            setIsOpen(false)
        }
    })

    useEffect(() => {
        handleCloseIfNotCurrent()
    }, [keyOfCurrentNode, popUpKey])

    useEffect(() => {
        contentRef.current = (
            <div className={styles.PopUp}>
                <div className={styles.main} ref={ref}>
                    <div className={styles.overflow}>
                        <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                            <FontAwesomeIcon icon={faX} />
                        </button>
                        <div className={styles.content}>
                            { children }
                        </div>
                    </div>
                </div>
            </div>
        )
        if (isOpen) {
            teleport(contentRef.current, popUpKey)
        }
    }, [children, isOpen, popUpKey, teleport, ref])

    const handleOpening = useCallback(() => {
        setIsOpen(true)
    }, [])

    return (
        <button
            className={`${styles.openBtn} ${showButtonClass}`}
            style={showButtonStyle}
            onClick={handleOpening}
        >
            {showButtonContent}
        </button>
    )
}
