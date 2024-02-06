import styles from './Textarea.module.scss'
import { TextareaHTMLAttributes } from 'react'
import { v4 as uuid } from 'uuid'

type PropTypes = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string
}

export default function Textarea({ label, ...props } : PropTypes) {
    const domId = uuid()

    return (
        <div className={styles.TextArea}>
            <label htmlFor={domId}>{ label }</label>
            <textarea id={domId} {...props}></textarea>
        </div>
    )
}
