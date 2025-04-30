import styles from './RadioLarge.module.scss'
import { v4 as uuid } from 'uuid'


export default function RadioLarge<ValueType extends number | string>({
    name,
    options,
    defaultValue,
    value,
    onChange,
}: {
    name: string,
    defaultValue?: ValueType,
    value?: ValueType,
    onChange?: (newValue: ValueType) => unknown,
    options: {
        value: ValueType,
        label: string,
    }[]
}) {
    return <div className={styles.radioContainer}>
        {options.map((option, i) => {
            const id = `${name}-${i}`
            return <div key={uuid()}>
                <input
                    type="radio"
                    name={name}
                    id={id}
                    value={option.value}
                    checked={value === undefined ? undefined : value === option.value}
                    defaultChecked={(defaultValue === undefined) ? undefined : defaultValue === option.value}
                    onChange={() => {
                        if (onChange) {
                            onChange(option.value)
                        }
                    }}
                />
                <label htmlFor={id} >
                    {option.label}
                </label>
            </div>
        })}
    </div>
}
