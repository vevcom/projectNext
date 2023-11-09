import { v4 as uuid } from 'uuid'
import { InputHTMLAttributes } from 'react'

import styles from './TextInput.module.scss'

type PropTypes = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
    label: string,
    type?: 'text' | 'password',
}

export default function TextInput({ label = 'default', ...props } : PropTypes) {
    props.id ??= `id_input_${uuid()}`
    props.type ??= 'text'

    return (
        <div className={styles.Input}>
            <input {...props}/>
            <label htmlFor={props.id}>{label}</label>
        </div>
    )
}
