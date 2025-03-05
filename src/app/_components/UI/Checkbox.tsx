import styles from './Checkbox.module.scss'
import type { InputHTMLAttributes, ReactNode } from 'react'


type PropTypes = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'name' | 'id'> & {
    label?: string
    children?: ReactNode
} & ({
    id: string
    name?: string | undefined
} | {
    name: string
    id?: string | undefined
})

/**
 * @param label - The label shown to user (optional)
 * @param children - If given, the children will be clickable as part of checkbox
 * @returns
 */
function Checkbox({ label, children, ...props }: PropTypes) {
    const inputId = props.id ?? props.name

    return (
        <div id={props.name} className={styles.Checkbox}>
            {
                children ? (
                    <label className={styles.inputAndChildren}>
                        <input type="checkbox" {...props} id={inputId} />
                        { children }
                        {label ? label : <></>}
                    </label>
                ) : (
                    <>
                        <input type="checkbox" {...props} id={inputId} />
                        {label && <label htmlFor={inputId}>{ label }</label>}
                    </>
                )
            }
        </div>
    )
}

export default Checkbox
