import styles from './Select.module.scss'
import { v4 as uuid } from 'uuid'

export default function Select<V extends number | string>({
    name,
    label,
    defaultValue,
    value,
    options,
    onChange,
} : {
    name: string,
    label?: string,
    value?: V,
    defaultValue?: V,
    options: {
        value: V,
        label?: string,
    }[],
    onChange?: (value: V) => void,
}) {
    const id = uuid()

    const optionElements = options.map(
        (option) => <option
            key={uuid()}
            value={option.value}
        >
            {option.label ?? option.value}
        </option>
    )

    return <div className={styles.Select}>
        <label htmlFor={id}>{label ?? name}</label>
        <select
            id={id}
            name={name}
            {
                ...(value ? { value } : { defaultValue })
            }
            onChange={(event) => {
                if (onChange && options.length > 0) {
                    const value = event.target.value
                    onChange((typeof(options[0].value) === 'number' ? Number(value) : value) as V)
                }
            }
        }>
            {optionElements}
        </select>
    </div>
}
