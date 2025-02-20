import styles from './TextInput.module.scss'
import type { InputHTMLAttributes } from 'react'


export type PropTypes = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'name' | 'id'> & {
    label: string,
    type?: 'text' | 'password',
    color?: 'primary' | 'secondary' | 'red' | 'black' | 'white',
} & ({
    id: string,
    name?: string | undefined,
} | {
    name: string,
    id?: string | undefined,
})

export default function TextInput({ label = 'default', type = 'text', color = 'black', className, ...props }: PropTypes) {
    props.id ??= `id_input_${props.name}`

    return (
        <div id={props.name} className={`${styles.TextInput} ${styles[color]} ${className}`}>
            <input {...props} type={type} className={styles.field} placeholder={label}/>
            <label className={styles.labe}>{label}</label>
        </div>
    )
}
