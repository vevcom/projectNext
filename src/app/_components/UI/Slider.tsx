import styles from './Slider.module.scss'
import type { PropTypes as TextInputPropTypes } from './TextInput'

type PropTypes = Omit<TextInputPropTypes, 'type'>

/**
 * This is really a regular checkbox styled as a slider
 * @param label - The label for the slider
 * @param name - The name of the slider
 * @returns
 */
export default function Slider({ label, name, ...props }: PropTypes) {
    return (
        <label className={styles.Slider}>
            <p className={styles.label}>{label}</p>
            <input {...props} name={name} type="checkbox" />
            <span className={styles.slider}></span>
        </label>
    )
}
