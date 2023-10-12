import styles from "./Input.module.scss"


function Input({label, type, id}) {
    label = (label !== undefined) ? label : ''
    type  = (type  !== undefined) ? type  : 'text'
    id    = (id    !== undefined) ? id    : "id_input_" + Math.random().toString(16).slice(2)

    return <div class={styles.Input}>
        <input type={type} id={id} required/>
        <label for={id}>{label}</label>
    </div>

}

export default Input