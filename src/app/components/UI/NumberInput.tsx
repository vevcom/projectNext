import React from 'react'
import { InputHTMLAttributes } from 'react'
import styles from './NumberInput.module.scss'

export type PropTypes = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
    label: string,
    color?: 'primary' | 'secondary' | 'red' | 'black' | 'white',
}

export default function NumberInput({ 
    label, 
    color = 'black', 
    className, 
    ...props 
} : PropTypes) {
    return (
        <div id={props.name} className={`${styles.NumberInput} ${styles[color]} ${className}`}>
            <input {...props} type="number" className={styles.field} placeholder={label}/>
            <label className={styles.labe}>{label}</label>
        </div>
    )
}