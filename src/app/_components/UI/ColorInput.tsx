import styles from './ColorInput.module.scss'
import type { InputHTMLAttributes } from 'react'

export type PropTypes = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
    label: string,
}

export default function ColorInput({ label, className, ...props }: PropTypes) {
    return (
        <div className={`${styles.ColorInput} ${className}`}>
            <label>{label}</label>
            <input type="color" {...props} />
        </div>
    )
}
