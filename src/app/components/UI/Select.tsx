import {  } from 'react'
import styles from './Select.module.scss'
import { v4 } from 'uuid'
import { SelectHTMLAttributes } from 'react'

export type Proptypes = SelectHTMLAttributes<HTMLSelectElement> & {
    name: string,
    label?: string,
    options: {
        value: string,
        label?: string,
    }[],
}

export default function Select({ name, label, options, ...props }: Proptypes) {
    const id = v4()

    const optionElements = options.map(
        (option) => <option key={v4()} value={option.value}>
            {option.label ?? option.value}
        </option>
    )

    return <div className={styles.Select}>
        <label htmlFor={id}>{label ?? name}</label>
        <select id={id} name={name} {...props}>
            {optionElements}
        </select>
    </div>
}
