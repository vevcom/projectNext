import styles from './Textarea.module.scss'
import { v4 as uuid } from 'uuid'
import type { TextareaHTMLAttributes } from 'react'

type PropTypes = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string,
    background?: 'base' | 'raised',
}

export default function Textarea({ label, background = 'base', className, ...props }: PropTypes) {
    const domId = uuid()

    return (
        <div className={`${styles.TextArea} ${background === 'raised' ? styles.onRaised : ''} ${className ?? ''}`}>
            <label htmlFor={domId}>{ label }</label>
            <textarea id={domId} {...props}></textarea>
        </div>
    )
}
