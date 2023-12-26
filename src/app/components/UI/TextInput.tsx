import { v4 as uuid } from 'uuid'
import { InputHTMLAttributes } from 'react'

import styles from './TextInput.module.scss'

type PropTypes = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
    label: string,
    type?: 'text' | 'password',
    color?: 'primary' | 'secondary' | 'red' | 'black',
}

export default function TextInput({ label = 'default', type, color, ...props } : PropTypes) {
    props.id ??= `id_input_${uuid()}`
    type ??= 'text'
    color ??= 'black'
    return (
        <div id={props.name} className={`${styles.TextInput} ${styles[color]}`}>
            <input {...props} type={type} className={styles.field} placeholder={label}/> 
            <label className={styles.labe}>{label}</label>
        </div>
    )
}
