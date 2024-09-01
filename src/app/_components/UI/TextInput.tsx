import styles from './TextInput.module.scss'
import { v4 as uuid } from 'uuid'
import type { InputHTMLAttributes } from 'react'


export type PropTypes = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
    label: string,
    type?: 'text' | 'password',
    color?: 'primary' | 'secondary' | 'red' | 'black' | 'white',
}

export default function TextInput({ label = 'default', type = 'text', color = 'black', className, ...props }: PropTypes) {
    props.id ??= `id_input_${uuid()}`

    return (
        <div id={props.name} className={`${styles.TextInput} ${styles[color]} ${className}`}>
            <input {...props} type={type} className={styles.field} placeholder={label}/>
            <label className={styles.labe}>{label}</label>
        </div>
    )
}
