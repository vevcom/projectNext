import styles from './DateInput.module.scss'
import type { PropTypes as PropTypesInput } from './TextInput'

type PropTypes = Omit<PropTypesInput, 'type' | 'defaultValue'> & {
    defaultValue?: PropTypesInput['defaultValue'] | Date,
    includeTime?: boolean,
}

export default function DateInput({
    label = 'default',
    color = 'black',
    className,
    defaultValue,
    includeTime = false,
    ...props
}: Omit<PropTypes, 'type'>) {
    const defaultValueTransformed = defaultValue instanceof Date
        ? defaultValue.toISOString().substring(0, includeTime ? 16 : 10)
        : defaultValue
    return (
        <div className={`${styles.DateInput} ${styles[color]} ${className}`}>
            <label className={styles.label}>{label}</label>
            <input defaultValue={defaultValueTransformed} {...props} type={includeTime ? 'datetime-local' : 'date'} />
        </div>
    )
}
