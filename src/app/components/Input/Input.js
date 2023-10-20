import { v4 as uuid } from 'uuid'
import styles from "./Input.module.scss"


function Input({label, type, id, name}) {
    label = (label !== undefined) ? label : ''
    type  = (type  !== undefined) ? type  : 'text'
    id    = (id    !== undefined) ? id    : "id_input_" + uuid()

    return <div className={styles.Input}>
        <input type={type} id={id} name={name} required/>
        <label htmlFor={id}>{label}</label>
    </div>

}

export default Input