import styles from './Checkbox.module.scss'
import type { InputHTMLAttributes, ReactNode } from 'react'
import SelectAsCheckbox from './SelectAsCheckbox'

type PropTypes = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'name' | 'id'> & {
    label?: string,
    children?: ReactNode
    name: string
    id?: string
}

/**
 * @param label - The label shown to user (optional)
 * @param children - If given, the children will be clickable as part of checkbox
 * @returns
 */
function Checkbox({ label, children, ...props }: PropTypes) {
    const inputId = props.id ?? `id_input_${props.name}`

    return (
        <div id={props.name} className={styles.Checkbox}>
            {
                children ? (
                    <label className={styles.inputAndChildren}>
                        <SelectAsCheckbox id={inputId} {...props} />
                        { children }
                        {label ? label : <></>}
                    </label>
                ) : (
                    <>
                        <SelectAsCheckbox id={inputId} {...props} />
                        {label && <label htmlFor={inputId}>{ label }</label>}
                    </>
                )
            }
        </div>
    )
}

export default Checkbox
