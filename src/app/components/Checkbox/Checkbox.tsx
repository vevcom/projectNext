import { v4 as uuid } from 'uuid'
import styles from "./Checkbox.module.scss";

type PropTypes = {
    label: string
}

function Checkbox({ label }: PropTypes) {
    const id = `id_input_${uuid()}`

    return <div className={styles.Checkbox}>
        <input type="checkbox" id={id}></input>
        <label htmlFor={id}>{ label }</label>
    </div>
}

export default Checkbox
