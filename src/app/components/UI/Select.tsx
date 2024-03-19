import styles from './Select.module.scss'
import { v4 as uuid } from 'uuid'

export type Proptypes = {
    name: string,
    label?: string,
    options: {
        value: string | number,
        label?: string,
    }[],
}

export default function Select({ name, label, options }: Proptypes) {
    const id = uuid()

    const optionElements = options.map(
        (option) => <option key={uuid()} value={option.value}>
            {option.label ?? option.value}
        </option>
    )

    return <div className={styles.Select}>
        <label htmlFor={id}>{label ?? name}</label>
        <select id={id} name={name}>
            {optionElements}
        </select>
    </div>
}
