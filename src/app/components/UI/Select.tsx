import styles from './Select.module.scss'
import { v4 as uuid } from 'uuid'
import type { HTMLAttributes } from 'react'

export default function Select<V extends number | string | boolean>({
    name,
    label,
    defaultValue,
    value,
    options,
    onChange,
    className,
}: {
    name: string,
    label?: string,
    value?: V,
    defaultValue?: V,
    options: {
        value: V,
        label?: string,
    }[],
    onChange?: (valu: V) => void,
} & Omit<HTMLAttributes<HTMLElement>, 'onChange'>) {
    const id = uuid()

    const optionElements = options.map(
        (option) => <option
            key={uuid()}
            value={option.value}
        >
            {option.label ?? option.value}
        </option>
    )

    return <div className={`${styles.Select} ${className}`}>
        <label htmlFor={id}>{label ?? name}</label>
        <select
            id={id}
            name={name}
            {
                ...(value ? { value } : { defaultValue })
            }
            onChange={(event) => {
                if (onChange && options.length > 0) {
                    const v = event.target.value
                    onChange((typeof (options[0].value) === 'number' ? Number(v) : v) as V)
                }
            }
            }>
            {optionElements}
        </select>
    </div>
}
