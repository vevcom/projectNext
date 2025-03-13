import CheckboxFieldPresent from './CheckboxFieldPresent'
import styles from './Slider.module.scss'
import type { PropTypes as TextInputPropTypes } from './TextInput'

type PropTypes = Omit<TextInputPropTypes, 'type'> & { name: string }

/**
 * This is really a regular checkbox styled as a slider
 * @param label - The label for the slider
 * @param name - The name of the slider
 * @returns
 */
export default function Slider({ label, name, color = 'secondary', ...props }: PropTypes) {
    return (
        <label className={`${styles.Slider} ${styles[color]}`}>
            <p className={styles.label}>{label}</p>
            <input type="checkbox" name={name} {...props} id={props.id ?? `id_for_${name}`} />
            <div className={styles.slider} />
            <CheckboxFieldPresent name={name} />
        </label>
    )
}
