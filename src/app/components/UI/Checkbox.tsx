import { v4 as uuid } from 'uuid'
import styles from './Checkbox.module.scss'
import { InputHTMLAttributes } from 'react'


type PropTypes = InputHTMLAttributes<HTMLInputElement> & {
    label: string
}

function Checkbox({ label, ...props }: PropTypes) {
    if (props.type && props.type !== 'checkbox') throw new Error('Checkbox only supports type="checkbox"')
    props.id ??= `id_input_${uuid()}`

    return <div className={styles.Checkbox}>
        <input type="checkbox" {...props} ></input>
        <label htmlFor={props.id}>{ label }</label>
    </div>
}

export default Checkbox
