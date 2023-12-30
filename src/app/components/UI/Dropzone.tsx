'use client'

import { 
    InputHTMLAttributes, 
    useCallback, 
    useState, 
    ChangeEvent, 
    DragEvent, 
    useRef,
} from 'react'
import styles from './Dropzone.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'

type PropTypes = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'name' | 'multiple'> & {
    label: string,
    color?: 'primary' | 'secondary' | 'red' | 'black',
    name: string,
}

const Dropzone = ({label, color, name, ...props } : PropTypes) => {
    const [files, setFiles] = useState<File[]>([])
    const input = useRef<HTMLInputElement>(null)

    color ??= 'black'

    const onDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const droppedFiles = Array.from(event.dataTransfer.files) as File[];
        setFiles(prev => [...prev, ...droppedFiles]);

        if (input.current) {
            const dataTransfer = new DataTransfer();
            droppedFiles.forEach(file => dataTransfer.items.add(file));
            input.current.files = dataTransfer.files;
        }
    }, []);
    const filesUpdated = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        const newFiles = Array.from(event.target.files ?? [])
        setFiles(prev => [...prev, ...newFiles])
    }, [])

    const onDragOver = (event: DragEvent<HTMLDivElement>) => event.preventDefault()

    return (
        <div onDrop={onDrop} onDragOver={onDragOver} className={styles.Dropzone}>
            <input name={name} onChange={filesUpdated} type="file" multiple {...props} />
            <p>{label}</p>
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