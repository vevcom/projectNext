import { v4 as uuid } from 'uuid'
import styles from "./Input.module.scss"


function Input({label, type, id}) {
    label = (label !== undefined) ? label : ''
    type  = (type  !== undefined) ? type  : 'text'
    id    = (id    !== undefined) ? id    : "id_input_" + uuid()

    return <div class={styles.Input}>
        <input type={type} id={id} required/>
        <label for={id}>{label}</label>
    </div>

}

export default Input