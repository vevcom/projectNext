import styles from './DateInput.module.scss'
import type { PropTypes } from './TextInput'

export default function DateInput({ 
    label = 'default', 
    color = 'black', 
    className, 
    ...props 
}: Omit<PropTypes, 'type'>) {
    return (
        <div className={`${styles.DateInput} ${styles[color]} ${className}`}>
            <label className={styles.label}>{label}</label>
            <input {...props} type="date" />
        </div>
    )
}
