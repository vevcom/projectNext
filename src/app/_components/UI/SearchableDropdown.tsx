'use client'
import styles from './SearchableDropdown.module.scss'
import useClickOutsideRef from '@/hooks/useClickOutsideRef'
import useKeyPress from '@/hooks/useKeyPress'
import { useEffect, useId, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import type { ChangeEvent, KeyboardEvent } from 'react'

export type SearchableDropdownOption<ValueType> = {
    value: ValueType,
    label?: string,
    key?: string,
}

export type PropTypes<ValueType> = {
    name: string,
    label: string,
    defaultValue?: ValueType,
    options: SearchableDropdownOption<ValueType>[],
    onChange?: (value: ValueType) => void,
    color?: 'primary' | 'secondary' | 'red' | 'black' | 'white',
    background?: 'base' | 'raised',
    className?: string,
    disabled?: boolean,
}

export default function SearchableDropdown<ValueType extends string | number>({
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
    const [searchTerm, setSearchTerm] = useState('')
    const [open, setOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0)
    const domId = useId()
    const panelRef = useRef<HTMLUListElement>(null)

    const close = () => {
        setOpen(false)
        setSearchTerm('')
    }
    const ref = useClickOutsideRef(close)
    useKeyPress('Escape', close)

    const selectedOption = options.find(option => option.value === value)

    const filteredOptions = options.filter(option =>
        (option.label ?? String(option.value)).toLowerCase().includes(searchTerm.toLowerCase())
    )

    useEffect(() => {
        if (!open) return
        panelRef.current?.querySelector(`.${styles.active}`)?.scrollIntoView({ block: 'nearest' })
    }, [activeIndex, open])

    const handleSelect = (option: SearchableDropdownOption<ValueType>) => {
        setValue(option.value)
        setSearchTerm('')
        setOpen(false)
        onChange?.(option.value)
    }

    const handleFocus = () => {
        const startIndex = value !== undefined ? filteredOptions.findIndex(option => option.value === value) : -1
        setActiveIndex(startIndex >= 0 ? startIndex : 0)
        setOpen(true)
    }

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value)
        setActiveIndex(0)
        if (!open) setOpen(true)
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (filteredOptions.length === 0) return
        if (event.key === 'ArrowDown') {
            event.preventDefault()
            if (!open) {
                setOpen(true)
                return
            }
            setActiveIndex(previousIndex => (previousIndex + 1) % filteredOptions.length)
        } else if (event.key === 'ArrowUp') {
            event.preventDefault()
            if (!open) {
                setOpen(true)
                return
            }
            setActiveIndex(previousIndex => (previousIndex - 1 + filteredOptions.length) % filteredOptions.length)
        } else if (event.key === 'Enter') {
            if (open && filteredOptions[activeIndex]) {
                event.preventDefault()
                handleSelect(filteredOptions[activeIndex])
            }
        }
    }

    const displayValue = open
        ? searchTerm
        : (selectedOption?.label ?? (selectedOption ? String(selectedOption.value) : ''))

    return (
        <div
            ref={ref}
            id={name}
            className={
                `${styles.SearchableDropdown} ${styles[color]} ` +
                `${background === 'raised' ? styles.onRaised : ''} ${open ? styles.open : ''} ${className ?? ''}`
            }
        >
            <input
                id={domId}
                type="text"
                className={styles.field}
                autoComplete="off"
                disabled={disabled}
                value={displayValue}
                onFocus={handleFocus}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                role="combobox"
                aria-expanded={open}
                aria-haspopup="listbox"
            />
            <label htmlFor={domId} className={`${styles.labe} ${(open || selectedOption) ? styles.floated : ''}`}>
                {label}
            </label>
            <FontAwesomeIcon icon={faChevronDown} className={styles.chevron} />
            {
                open && (
                    <ul className={styles.panel} role="listbox" ref={panelRef}>
                        {
                            filteredOptions.length > 0 ? filteredOptions.map((option, index) => (
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
                            )) : (
                                <li className={styles.empty}>Ingen treff</li>
                            )
                        }
                    </ul>
                )
            }
            <input type="hidden" name={name} value={value ?? ''} readOnly />
        </div>
    )
}
