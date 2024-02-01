import styles from './Checkbox.module.scss'
import { v4 as uuid } from 'uuid'
import { InputHTMLAttributes } from 'react'


type PropTypes = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
    label: string
}

function Checkbox({ label, ...props }: PropTypes) {
    props.id ??= `id_input_${uuid()}`

    return (
        <div id={props.name} className={styles.Checkbox}>
            <input type="checkbox" {...props} ></input>
            <label htmlFor={props.id}>{ label }</label>
        </div>
    )
}

export default Checkbox
