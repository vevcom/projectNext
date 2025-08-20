'use client'
import styles from './PopUp.module.scss'
import useKeyPress from '@/hooks/useKeyPress'
import { PopUpContext } from '@/contexts/PopUp'
import useClickOutsideRef from '@/hooks/useClickOutsideRef'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'
import { useContext, useEffect, useState, useRef, useCallback } from 'react'
import type { ReactNode, CSSProperties } from 'react'
import type { PopUpKeyType } from '@/contexts/PopUp'

export type PropTypes = {
    children: ReactNode,
    PopUpKey: PopUpKeyType,
    customShowButton?: (open: () => void) => ReactNode,
    showButtonContent?: ReactNode,
    showButtonClass?: string,
    showButtonStyle?: CSSProperties,
}

export default function PopUp({
    PopUpKey,
    children,
    customShowButton,
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
            popUpContext.teleport(contentRef.current, PopUpKey)
        }
    }, [children])

    const handleOpening = useCallback(() => {
        setIsOpen(true)
    }, [])

    return <>{
        customShowButton ? (
            customShowButton(handleOpening)
        ) : (
            <button
                className={`${styles.openBtn} ${showButtonClass}`}
                style={showButtonStyle}
                onClick={handleOpening}
            >
                {showButtonContent}
            </button>
        )
    }</>
}
