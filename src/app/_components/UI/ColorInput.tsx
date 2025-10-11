import styles from './ColorInput.module.scss'
import type { InputHTMLAttributes } from 'react'

export type PropTypes = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
    defaultValueRGB?: {
        red: number,
        green: number,
        blue: number
    }
    label: string,
}

const rgbToHex = (red: number, green: number, blue: number): string => {
    const toHex = (value: number) => {
        const hex = value.toString(16)
        return hex.length === 1 ? `0${hex}` : hex
    }

    return `#${toHex(red)}${toHex(green)}${toHex(blue)}`
}

/**
 * A component for selecting a color. Uses the HTML input type color and native browser color picker.
 * @param label - the label of the input (displayed to user)
 * @param className - the class name of the input
 * @param defaultValueRGB - the default value of the input in RGB format
 * @prop name - the name of the input
 * @returns
 */
export default function ColorInput({ label, className, defaultValueRGB, ...props }: PropTypes) {
    if (defaultValueRGB) {
        const { red, green, blue } = defaultValueRGB
        props.defaultValue = rgbToHex(red, green, blue)
    }
    return (
        <div className={`${styles.ColorInput} ${className}`}>
            <label>{label}</label>
            <input type="color" {...props} />
        </div>
    )
}
