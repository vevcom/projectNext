'use client'
import styles from './ModeSwitch.module.scss'
import { motion } from 'framer-motion'
import { useId } from 'react'

type PropTypes<ValueType extends string> = {
    options: {
        value: ValueType,
        label: string,
    }[],
    value: ValueType,
    onChange: (newValue: ValueType) => void,
}

/**
 * A segmented switch between a small set of options. The active option's background is a
 * single shared element (framer-motion layoutId) that slides to its new position, rather
 * than a class swap on each button.
 */
export default function ModeSwitch<ValueType extends string>({ options, value, onChange }: PropTypes<ValueType>) {
    const layoutId = useId()

    return (
        <div className={styles.ModeSwitch}>
            {options.map(option => {
                const active = option.value === value
                return (
                    <button
                        key={option.value}
                        type="button"
                        className={active ? styles.active : ''}
                        aria-pressed={active}
                        onClick={() => onChange(option.value)}
                    >
                        {active && (
                            <motion.span
                                layoutId={layoutId}
                                className={styles.indicator}
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                            />
                        )}
                        <span className={styles.label}>{option.label}</span>
                    </button>
                )
            })}
        </div>
    )
}
