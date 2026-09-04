'use client'
import styles from './GlobalSearch.module.scss'
import useKeyPress from '@/hooks/useKeyPress'
import useClickOutsideRef from '@/hooks/useClickOutsideRef'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useRef, useState } from 'react'

/**
 * Global command-K search popup, opened from anywhere on the site with Ctrl+K / Cmd+K
 * and closed with Escape or an outside click. UI shell only for now — the input doesn't
 * run any search yet.
 */
export default function GlobalSearch() {
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    const close = () => {
        setIsOpen(false)
        setQuery('')
    }
    const ref = useClickOutsideRef(close)
    useKeyPress('Escape', close)

    useEffect(() => {
        const handleShortcut = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault()
                setIsOpen(previousOpen => {
                    if (previousOpen) setQuery('')
                    return !previousOpen
                })
            }
        }
        window.addEventListener('keydown', handleShortcut)
        return () => window.removeEventListener('keydown', handleShortcut)
    }, [])

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus()
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className={styles.GlobalSearch}>
            <div className={styles.main} ref={ref}>
                <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.icon} />
                <input
                    ref={inputRef}
                    type="text"
                    className={styles.field}
                    placeholder="Søk..."
                    autoComplete="off"
                    value={query}
                    onChange={event => setQuery(event.target.value)}
                />
                <kbd className={styles.escHint}>ESC</kbd>
            </div>
        </div>
    )
}
