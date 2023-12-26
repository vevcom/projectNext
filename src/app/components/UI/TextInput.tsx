import { v4 as uuid } from 'uuid'
import { InputHTMLAttributes } from 'react'

import styles from './TextInput.module.scss'

type PropTypes = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
    label: string,
    type?: 'text' | 'password',
    color?: 'primary' | 'secondary',
}

export default function TextInput({ label = 'default', type, color, ...props } : PropTypes) {
    props.id ??= `id_input_${uuid()}`
    type ??= 'text'
    return (
        <div id={props.name} style={{color: color}} className={styles.TextInput}>
            <input {...props} style={{borderColor: color}} type={type} className={styles.field} placeholder={label}/> 
            <label style={{color: color}} className={styles.labe}>{label}</label>
        </div>
    )
}
