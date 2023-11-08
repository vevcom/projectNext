import { v4 as uuid } from 'uuid'
import { InputHTMLAttributes } from 'react'

import styles from './TextInput.module.scss'

type PropTypes = InputHTMLAttributes<HTMLInputElement> & {
    label?: string
}

export default function TextInput({ label, ...props } : PropTypes) {
    label ??= ''
    props.type ??= 'text'
    props.id ??= `id_input_${uuid()}`
    
    return (
        <div className={styles.Input}>
            <input {...props}/>
            <label htmlFor={props.id}>{label}</label>
        </div>
    )
}