import { v4 } from 'uuid';
import styles from './Select.module.scss'

export type Proptypes = {
    name: string,
    label?: string,
    options: Array<{
        value: string,
        label?: string,
    }>,
}

export default function Select({name, label, options} : Proptypes) {

    const id = v4()

    const optionElements = options.map((option) => {
        return <option key={v4()} value={option.value}>{option.label ?? option.value}</option>
    })

    return <div className={styles.Select}>
        <label htmlFor={id}>{label ?? name}</label>
        <select id={id} name={name}>
            {optionElements}
        </select>
    </div>
}