import { v4 as uuid } from 'uuid'
import styles from "./Checkbox.module.scss";

type propTypes = {
    label: string
}

function Checkbox({ label }: propTypes) {
    const id = "id_input_" + uuid();

    return <div className={styles.Checkbox}>
        <input type="checkbox" id={id}></input>
        <label htmlFor={id}>{ label }</label>
    </div>
}

export default Checkbox