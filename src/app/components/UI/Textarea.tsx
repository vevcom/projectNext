import styles from './Textarea.module.scss'
import { v4 as uuid } from 'uuid'
import type { TextareaHTMLAttributes } from 'react'

type PropTypes = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string
}

export default function Textarea({ label, ...props }: PropTypes) {
    const domId = uuid()

    return (
        <div className={styles.TextArea}>
            <label htmlFor={domId}>{ label }</label>
            <textarea id={domId} {...props}></textarea>
        </div>
    )
}
