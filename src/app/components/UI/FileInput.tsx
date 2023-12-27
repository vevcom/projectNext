import { v4 as uuid } from 'uuid'
import { InputHTMLAttributes } from 'react'

import styles from './FileInput.module.scss'

type PropTypes = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
    label: string,
    color?: 'primary' | 'secondary' | 'red' | 'black',
}

export default function FileInput({ label = 'default', color, ...props } : PropTypes) {
    props.id ??= `id_input_${uuid()}`
    color ??= 'black'
    return (
        <div id={props.name} className={`${styles.FileInput} ${styles[color]}`}>
            <input {...props} type="file" className={styles.field} />
            <label className={styles.label}>{label}</label>
        </div>
    )
}