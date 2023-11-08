import { v4 as uuid } from 'uuid'
import { InputHTMLAttributes } from 'react'

import styles from './TextInput.module.scss'

type PropTypes = InputHTMLAttributes<HTMLInputElement> & {
    label?: string
}

export default function TextInput({ label = 'default', ...props } : PropTypes) {
    if (props.type && props.type !== 'text') throw new Error('TextInput only supports type="text"')
    props.id ??= `id_input_${uuid()}`

    return (
        <div className={styles.Input}>
            <input type="text" {...props}/>
            <label htmlFor={props.id}>{label}</label>
        </div>
    )
}
