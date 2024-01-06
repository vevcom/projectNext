'use client'

import React, {
    InputHTMLAttributes,
    useCallback,
    useState,
    ChangeEvent,
    DragEvent,
    useRef,
    useEffect,
} from 'react'
import styles from './Dropzone.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faTrash } from '@fortawesome/free-solid-svg-icons'

type PropTypes = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'name' | 'multiple'> & {
    label: string,
    name: string,
}

const byteToUnderstandable = (bytes: number) : string => {
    if (bytes < 1024) {
        return `${bytes} bytes`
    }
    if (bytes < 1024 ** 2) {
        return `${(bytes / 1024).toFixed(2)} KB`
    }
    return `${(bytes / 1024 ** 2).toFixed(2)} MB`
}

const Dropzone = ({ label, name, ...props } : PropTypes) => {
    const [files, setFiles] = useState<File[]>([])
    const input = useRef<HTMLInputElement>(null)


    //Databindes the file state to the input value
    useEffect(() => {
        if (input.current) {
            const dataTransfer = new DataTransfer()
            files.forEach(file => dataTransfer.items.add(file))
            input.current.files = dataTransfer.files
        }
    }, [files])

    const onDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        const droppedFiles = Array.from(event.dataTransfer.files)
        setFiles(prev => [...prev, ...droppedFiles])

        if (input.current) {
            input.current.blur()
        }
    }, [])
    const filesUpdated = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        const newFiles = Array.from(event.target.files ?? [])
        setFiles(prev => [...prev, ...newFiles])
        if (input.current) {
            input.current.blur()
        }
    }, [])

    const onDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        input.current?.focus()
    }

    const onDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        if (input.current) {
            input.current.blur()
        }
    }

    const handleRemove = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, file: File) => {
        event.preventDefault()
        setFiles(prev => prev.filter(f => f !== file))
    }
    const handleRemoveAll = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault()
        setFiles([])
    }

    return (
        <div className={styles.Dropzone}>
            <div onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave} className={styles.uploader}>
                <input ref={input} name={name} onChange={filesUpdated} type="file" multiple {...props} />
                <p>{label}</p>
                <FontAwesomeIcon icon={faUpload} />
            </div>
            <span>
                <div className={styles.general}>
                    <p>Til opplastning {files.length} {files.length === 1 ? 'fil' : 'filer'}</p>
                    <p>Total størrelse: {byteToUnderstandable(files.reduce((acc, file) => acc + file.size, 0))}</p>
                    <p>
                        <button className={styles.trash} onClick={handleRemoveAll}>
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </p>
                </div>
                <ul>
                    {files.map((file, index) => (
                        <li key={index}>
                            <img src={URL.createObjectURL(file)} alt={file.name} />
                            <p>{file.name}</p>
                            <p>{byteToUnderstandable(file.size)}</p>
                            <button className={styles.trash} onClick={(e) => handleRemove(e, file)}>
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </li>
                    ))}
                </ul>
            </span>
        </div>
    )
}

export default Dropzone
