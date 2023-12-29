'use client'

import { InputHTMLAttributes, useCallback, useState, useRef } from 'react'
import styles from './Dropzone.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'

type PropTypes = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'name'> & {
    label: string,
    color?: 'primary' | 'secondary' | 'red' | 'black',
    name: string,
}

const Dropzone = ({...props}:PropTypes) => {
    const [files, setFiles] = useState<File[]>([]);
    const input = useRef<HTMLInputElement>(null);

    const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        const droppedFiles = Array.from(event.dataTransfer.files)
        setFiles(prev => [...prev, ...droppedFiles])
    }, []);

    const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
    }

    return (
        <div onDrop={onDrop} onDragOver={onDragOver} className={styles.Dropzone}>
            <input ref={input} type="file" multiple />
            <FontAwesomeIcon icon={faUpload} />
            <ul>
                {files.map((file, index) => (
                    <li key={index}>{file.name}</li>
                ))}
            </ul>
        </div>
    )
}

export default Dropzone;