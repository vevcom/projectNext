'use client'

import styles from './PopUp.module.scss'
import useKeyPress from '@/hooks/useKeyPress'
import { PopUpContext } from '@/contexts/PopUp'
import useClickOutsideRef from '@/hooks/useClickOutsideRef'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useContext, useEffect, useState, useRef, useCallback } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { ReactNode, CSSProperties } from 'react'
import type { PopUpKeyType } from '@/contexts/PopUp'

export type PropTypes = {
    children: ReactNode,
    customShowButton?: (open: () => void) => ReactNode,
    showButtonContent?: ReactNode,
    showButtonClass?: string,
    showButtonStyle?: CSSProperties,
    storeInUrl?: boolean,
} & (
    // The prop `PopUpKey` should actually be `popUpKey`.
    // For backwards compatibility, we support both for now.
    // TODO: Fully remove PopUpKey.
    {
        /** @deprecated Use `popUpKey` instead. */
        PopUpKey: PopUpKeyType,
        popUpKey?: never
    } | {
        popUpKey: PopUpKeyType,
        /** @deprecated Use `popUpKey` instead. */
        PopUpKey?: never
    }
)

export default function PopUp({
    PopUpKey,
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

    const effectivePopUpKey = popUpKey ?? PopUpKey

    // This should never happen due to static type checks, but
    // TypeScript isn't smart enough to see that in this case.
    if (!effectivePopUpKey) {
        throw new Error('The popUpKey prop is required for the PopUp component')
    }

    const popUpContext = useContext(PopUpContext)
    useKeyPress('Escape', () => setIsOpen(false))
    const ref = useClickOutsideRef(() => setIsOpen(false))
    const contentRef = useRef<ReactNode>(null)

    if (!popUpContext) throw new Error('Pop up context needed for popups')

    useEffect(() => {
        if (isOpen) {
            popUpContext.teleport(contentRef.current, effectivePopUpKey)
        } else {
            popUpContext.remove(effectivePopUpKey)
        }
    }, [isOpen])

    useEffect(() => {
        if (popUpContext.keyOfCurrentNode !== effectivePopUpKey) {
            setIsOpen(false)
        }
    }, [popUpContext.keyOfCurrentNode])

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
            popUpContext.teleport(contentRef.current, effectivePopUpKey)
        }
    }, [children])

    useEffect(() => {
        if (!storeInUrl) return

        const params = new URLSearchParams(searchParams.toString())
        const keyInUrl = params.get('pop-up-key') === effectivePopUpKey

        if (keyInUrl && !isOpen) {
            setIsOpen(true)
        }
    }, [storeInUrl, isOpen, searchParams, effectivePopUpKey])

    useEffect(() => {
        if (!storeInUrl) return

        const params = new URLSearchParams(searchParams.toString())
        const keyInUrl = params.get('pop-up-key') === effectivePopUpKey

        if (isOpen) {
            // Set the pop-up key in the URL to indicate that this pop-up is open.
            // There should only be one pop-up open at a time, so we can just set it directly.
            params.set('pop-up-key', String(effectivePopUpKey))
        } else if (keyInUrl) {
            // We check if the key is our key to avoid removing another pop-up's key.
            params.delete('pop-up-key')
        }

        const newUrl = `${pathName}?${params.toString()}`
        const oldUrl = `${pathName}?${searchParams.toString()}`

        if (newUrl !== oldUrl) {
            router.replace(`${pathName}?${params.toString()}`)
        }
    }, [storeInUrl, pathName, searchParams, isOpen, effectivePopUpKey])

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
