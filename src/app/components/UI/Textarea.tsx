import styles from './Textarea.module.scss'
import { TextareaHTMLAttributes } from 'react'
import { v4 } from 'uuid'

type PropTypes = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string
}

export default function Textarea({ label, ...props } : PropTypes) {
    const uuid = v4()

    return (
        <div className={styles.TextArea}>
            <label htmlFor={uuid}>{ label }</label>
            <textarea id={uuid} {...props}></textarea>
        </div>
    )
}
