import styles from './Select.module.scss'
import { v4 as uuid } from 'uuid'

export default function Select({
    name,
    label,
    defaultValue,
    options,
} : {
    name: string,
    label?: string,
    defaultValue?: string | number,
    options: {
        value: string | number,
        label?: string,
    }[],
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
        <select id={id} name={name} defaultValue={defaultValue}>
            {optionElements}
        </select>
    </div>
}
