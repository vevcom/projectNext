'use client'

import React, { useCallback, useState } from 'react'
import styles from './Dropzone.module.scss'

const Dropzone = () => {
    const [files, setFiles] = useState<File[]>([]);

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
            Drop some files here!
            <ul>
                {files.map((file, index) => (
                    <li key={index}>{file.name}</li>
                ))}
            </ul>
        </div>
    )
}

export default Dropzone;