import { v4 as uuid } from 'uuid'
import styles from "./FormInput.module.scss"

type propTypes = {
    label?: string,
    type?: string,
    id?: string,
    name: string,
}

function FormInput({label, type, id, name} : propTypes) {
    label ??=  ''
    type  ??= (type  !== undefined) ? type  : 'text'
    id    ??= "id_input_" + uuid()

    return <div className={styles.Input}>
        <input type={type} id={id} name={name} required/>
        <label htmlFor={id}>{label}</label>
    </div>

}

export default FormInput