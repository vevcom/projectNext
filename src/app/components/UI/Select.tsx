import styles from './Select.module.scss'
import { v4 } from 'uuid'
import type { SelectHTMLAttributes } from 'react'

export type Proptypes = SelectHTMLAttributes<HTMLSelectElement> & {
    name: string,
    label?: string,
    options: {
        value: string,
        label?: string,
        key: string,
    }[],
}

export default function Select({ name, label, options, ...props }: Proptypes) {
    const id = v4()

    const optionElements = options.map(
        (option) => <option key={option.key} value={option.value}>
            {option.label ?? option.value}
        </option>
    )

    return <div className={styles.Select}>
        <label htmlFor={id}>{label ?? name}</label>
        <select {...props} id={id} name={name}>
            {optionElements}
        </select>
    </div>
}
