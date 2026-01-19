import styles from './NumberInput.module.scss'
import React from 'react'
import type { InputHTMLAttributes } from 'react'

export type PropTypes = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
    label: string,
    color?: 'primary' | 'secondary' | 'red' | 'black' | 'white',
}

export default function NumberInput({
    label,
    color = 'black',
    className,
    ...props
}: PropTypes) {
    return (
        <div id={props.name} className={`${styles.NumberInput} ${styles[color]} ${className}`}>
            <input {...props} type="number" className={styles.field} placeholder={label} />
            <label className={styles.labe}>{label}</label>
        </div>
    )
}
