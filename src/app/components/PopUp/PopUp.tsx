'use client'
import styles from './PopUp.module.scss'
import Button from '@/components/UI/Button'
import useKeyPress from '@/hooks/useKeyPress'
import { PopUpContext } from '@/context/PopUp'
import useClickOutsideRef from '@/hooks/useClickOutsideRef'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'
import { useContext, useEffect, useState, useRef, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { PopUpKeyType } from '@/context/PopUp'

export type PropTypes = {
    children: ReactNode,
    showButtonContent: ReactNode,
    showButtonClass?: string,
    PopUpKey: PopUpKeyType,
}

export default function PopUp({
    PopUpKey,
    children,
    showButtonContent,
    showButtonClass,
}: PropTypes) {
    const [isOpen, setIsOpen] = useState(false)


    const popUpContext = useContext(PopUpContext)
    useKeyPress('Escape', () => setIsOpen(false))
    const ref = useClickOutsideRef(() => setIsOpen(false))
    const contentRef = useRef<ReactNode>(null)

    if (!popUpContext) throw new Error('Pop up context needed for popups')

    useEffect(() => {
        if (isOpen) {
            popUpContext.teleport(contentRef.current, PopUpKey)
        } else {
            popUpContext.remove(PopUpKey)
        }
    }, [isOpen])

    useEffect(() => {
        if (popUpContext.keyOfCurrentNode !== PopUpKey) {
            setIsOpen(false)
        }
    }, [popUpContext.keyOfCurrentNode])

    useEffect(() => {
        contentRef.current = (
            <div className={styles.PopUp}>
                <div className={styles.main} ref={ref}>
                    <Button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                        <FontAwesomeIcon icon={faX} />
                    </Button>
                    <div className={styles.content}>
                        { children }
                    </div>
                </div>
            </div>
        )
        if (isOpen) {
            popUpContext.teleport(contentRef.current, PopUpKey)
        }
    }, [children])

    const handleOpening = useCallback(() => {
        setIsOpen(true)
    }, [])

    return (
        <button className={`${styles.openBtn} ${showButtonClass}`} onClick={handleOpening}>
            {showButtonContent}
        </button>
    )
}
