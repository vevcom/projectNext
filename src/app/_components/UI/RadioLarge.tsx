import styles from './RadioLarge.module.scss'
import { v4 as uuid } from 'uuid'


export default function RadioLarge<ValueType extends string>({
    name,
    options,
    defaultValue,
    onChange,
}: {
    name: string,
    defaultValue?: ValueType,
    onChange?: (newValue: ValueType) => unknown,
    options: {
        value: ValueType,
        label: string,
    }[]
}) {
    return <div className={styles.radioContainer}>
        {options.map(option => {
            const id = uuid()
            return <div key={uuid()}>
                <input
                    type="radio"
                    name={name}
                    id={id}
                    value={option.value}
                    defaultChecked={defaultValue ? defaultValue === option.value : false}
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
