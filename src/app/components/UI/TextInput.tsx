import styles from './TextInput.module.scss'
import { v4 as uuid } from 'uuid'
import { InputHTMLAttributes } from 'react'


type PropTypes = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
    label: string,
    type?: 'text' | 'password',
    color?: 'primary' | 'secondary' | 'red' | 'black',
}

export default function TextInput({ label = 'default', type = 'text', color = 'black', ...props } : PropTypes) {
    props.id ??= `id_input_${uuid()}`

    return (
        <div id={props.name} className={`${styles.TextInput} ${styles[color]}`}>
            <input {...props} type={type} className={styles.field} placeholder={label}/>
            <label className={styles.labe}>{label}</label>
        </div>
    )
}
