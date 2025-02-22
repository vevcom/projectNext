'use client'
import styles from './FileInput.module.scss'
import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import type { InputHTMLAttributes, ChangeEvent } from 'react'


type PropTypes = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
    label: string,
    color?: 'primary' | 'secondary' | 'red' | 'black',
}

export default function FileInput({ label = 'default', color, ...props }: PropTypes) {
    props.id ??= `id_input_${uuid()}`
    color ??= 'black'

    const [fileName, setFileName] = useState('')

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setFileName(e.target.files[0].name)
        props.onChange?.(e)
    }

    return (
        <div id={props.name} className={`${styles.FileInput} ${styles[color]}`}>
            <input {...props} type="file" name={props.name} className={styles.field} onChange={handleFileChange} />
            <label htmlFor={props.id} className={styles.label}>{label}</label>
            <div className={styles.fileName}>{fileName}</div>
        </div>
    )
}
