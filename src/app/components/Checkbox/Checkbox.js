import { v4 as uuid } from 'uuid'
import styles from "./Checkbox.module.scss";

function Checkbox({ label }) {

    const id = "id_input_" + uuid();

    return <div className={styles.Checkbox}>
        <input type="checkbox" id={id}></input>
        <label for={id}>{ label }</label>
    </div>
}

export default Checkbox