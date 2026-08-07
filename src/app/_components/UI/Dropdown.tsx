'use client'
import styles from './Dropdown.module.scss'
import useClickOutsideRef from '@/hooks/useClickOutsideRef'
import useKeyPress from '@/hooks/useKeyPress'
import { useEffect, useId, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import type { KeyboardEvent, ReactNode } from 'react'

export type DropdownOption<ValueType> = {
    value: ValueType,
    label?: ReactNode,
    key?: string,
}

export type PropTypes<ValueType> = {
    name: string,
    label: string,
    defaultValue?: ValueType,
    options: DropdownOption<ValueType>[],
    onChange?: (value: ValueType) => void,
    color?: 'primary' | 'secondary' | 'red' | 'black' | 'white',
    background?: 'base' | 'raised',
    className?: string,
    disabled?: boolean,
}

export default function Dropdown<ValueType extends string | number>({
    name,
    label,
    defaultValue,
    options,
    onChange,
    color = 'black',
    background = 'base',
    className,
    disabled,
}: PropTypes<ValueType>) {
    const [value, setValue] = useState<ValueType | undefined>(defaultValue)
    const [open, setOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(-1)
    const domId = useId()
    const panelRef = useRef<HTMLUListElement>(null)

    const close = () => setOpen(false)
    const ref = useClickOutsideRef(close)
    useKeyPress('Escape', close)

    const selectedOption = options.find(option => option.value === value)

    useEffect(() => {
        if (!open) return
        panelRef.current?.querySelector(`.${styles.active}`)?.scrollIntoView({ block: 'nearest' })
    }, [activeIndex, open])

    const handleSelect = (option: DropdownOption<ValueType>) => {
        setValue(option.value)
        setOpen(false)
        onChange?.(option.value)
    }

    const openWithActive = () => {
        const startIndex = value !== undefined ? options.findIndex(option => option.value === value) : -1
        setActiveIndex(startIndex >= 0 ? startIndex : 0)
        setOpen(true)
    }

    const handleTriggerClick = () => {
        if (open) {
            setOpen(false)
        } else {
            openWithActive()
        }
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
        if (options.length === 0) return
        if (event.key === 'ArrowDown') {
            event.preventDefault()
            if (!open) {
                openWithActive()
                return
            }
            setActiveIndex(previousIndex => (previousIndex + 1) % options.length)
        } else if (event.key === 'ArrowUp') {
            event.preventDefault()
            if (!open) {
                openWithActive()
                return
            }
            setActiveIndex(previousIndex => (previousIndex - 1 + options.length) % options.length)
        } else if (event.key === 'Enter') {
            if (open && options[activeIndex]) {
                event.preventDefault()
                handleSelect(options[activeIndex])
            }
        }
    }

    return (
        <div
            ref={ref}
            id={name}
            className={
                `${styles.Dropdown} ${styles[color]} ` +
                `${background === 'raised' ? styles.onRaised : ''} ${open ? styles.open : ''} ${className ?? ''}`
            }
        >
            <button
                type="button"
                id={domId}
                className={styles.trigger}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={handleTriggerClick}
                onKeyDown={handleKeyDown}
            >
                <span className={styles.value}>{selectedOption?.label ?? selectedOption?.value ?? ''}</span>
                <FontAwesomeIcon icon={faChevronDown} className={styles.chevron} />
            </button>
            <label
                htmlFor={domId}
                className={`${styles.labe} ${(open || selectedOption) ? styles.floated : ''}`}
            >
                {label}
            </label>
            {
                open && (
                    <ul className={styles.panel} role="listbox" ref={panelRef}>
                        {
                            options.map((option, index) => (
                                <li key={option.key ?? String(option.value)}>
                                    <button
                                        type="button"
                                        role="option"
                                        aria-selected={option.value === value}
                                        className={
                                            `${option.value === value ? styles.selected : ''} ` +
                                            `${index === activeIndex ? styles.active : ''}`
                                        }
                                        onClick={() => handleSelect(option)}
                                        onMouseEnter={() => setActiveIndex(index)}
                                    >
                                        <span>{option.label ?? option.value}</span>
                                        {option.value === value && <FontAwesomeIcon icon={faCheck} />}
                                    </button>
                                </li>
                            ))
                        }
                    </ul>
                )
            }
            <input type="hidden" name={name} value={value ?? ''} readOnly />
        </div>
    )
}
