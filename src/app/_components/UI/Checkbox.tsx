import styles from './Checkbox.module.scss'
import { v4 as uuid } from 'uuid'
import type { InputHTMLAttributes, ReactNode } from 'react'


type PropTypes = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
    label?: string
    children?: ReactNode
}

/**
 *
 * @param label - The label shown to user (optional)
 * @param children - If given, the children will be clickable as part of checkbox
 * @returns
 */
function Checkbox({ label, children, ...props }: PropTypes) {
    props.id ??= `id_input_${uuid()}`

    return (
        <div id={props.name} className={styles.Checkbox}>
            {
                children ? (
                    <label className={styles.inputAndChildren}>
                        <input type="checkbox" {...props} />
                        { children }
                        {label ? label : <></>}
                    </label>
                ) : (
                    <>
                        <input type="checkbox" {...props} />
                        {label && <label htmlFor={props.id}>{ label }</label>}
                    </>
                )
            }
        </div>
    )
}

export default Checkbox
