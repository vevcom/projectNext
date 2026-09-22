'use client'

import styles from './PopUp.module.scss'
import useKeyPress from '@/hooks/useKeyPress'
import { PopUpContext } from '@/contexts/PopUp'
import useClickOutsideRef from '@/hooks/useClickOutsideRef'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useContext, useEffect, useState, useRef, useCallback, useEffectEvent } from 'react'
import type { ReactNode, CSSProperties } from 'react'
import type { PopUpKeyType } from '@/contexts/PopUp'

export type PropTypes = {
    children: ReactNode,
    customShowButton?: (open: () => void) => ReactNode,
    showButtonContent?: ReactNode,
    showButtonClass?: string,
    showButtonStyle?: CSSProperties,
    storeInUrl?: boolean,
    popUpKey: PopUpKeyType
}

export default function PopUp({
    popUpKey,
    children,
    customShowButton,
    showButtonContent,
    showButtonClass,
    showButtonStyle,
    storeInUrl = false,
}: PropTypes) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathName = usePathname()
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
                            <FontAwesomeIcon icon={faXmark} />
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

    const handleSearchParamsChange = useEffectEvent(() => {
        if (!storeInUrl) return

        const params = new URLSearchParams(searchParams.toString())
        const keyInUrl = params.get('pop-up-key') === popUpKey

        if (keyInUrl && !isOpen) {
            setIsOpen(true)
        }
    })

    useEffect(() => {
        handleSearchParamsChange()
    }, [searchParams])

    const handleIsOpenChange = useEffectEvent(() => {
        if (!storeInUrl) return

        const params = new URLSearchParams(searchParams.toString())
        const keyInUrl = params.get('pop-up-key') === popUpKey

        if (isOpen) {
            // Set the pop-up key in the URL to indicate that this pop-up is open.
            // There should only be one pop-up open at a time, so we can just set it directly.
            params.set('pop-up-key', String(popUpKey))
        } else if (keyInUrl) {
            // We check if the key is our key to avoid removing another pop-up's key.
            params.delete('pop-up-key')
        }

        const newUrl = `${pathName}?${params.toString()}`
        const oldUrl = `${pathName}?${searchParams.toString()}`

        if (newUrl !== oldUrl) {
            router.replace(`${pathName}?${params.toString()}`)
        }
    })

    useEffect(() => {
        handleIsOpenChange()
    }, [isOpen])

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
